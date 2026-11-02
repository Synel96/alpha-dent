import { inject, track } from "@vercel/analytics";

// Vercel Web Analytics: cookieless visitor statistics (no data stored on the
// device, so no consent banner) - see section 3.5 of lib/privacy-policy.ts.
// The script is served from this site (/_vercel/insights/script.js), so the
// CSP's script-src/connect-src 'self' already allow it, and it follows the
// client-side page changes by itself. Counted only once Web Analytics is
// enabled for the project on Vercel; locally the script simply isn't there.
//
// On top of page views, a few custom events (Vercel Pro) measure the
// conversions: the appointment request and the call / e-mail links. They
// only ever carry which button and where - never anything typed into the
// form (name, phone number, message).

// Where an "Időpontot kérek" button sits, for the Booking Open event.
export type BookingSource =
  | "hero"
  | "home-contact"
  | "header"
  | "mobile-bar"
  | "clinic-page"
  | "service-page";

export type AnalyticsEvent =
  // The appointment request modal was opened.
  | { name: "Booking Open"; props: { source: BookingSource; service: string } }
  // "Tovább a küldéshez": the e-mail is ready (opened on phones; on
  // computers the visitor picks how to send it next).
  | { name: "Booking Submit"; props: { device: "mobile" | "desktop" } }
  // On a computer: how they chose to send it.
  | { name: "Booking Channel"; props: { channel: "mail-app" | "gmail" | "outlook" | "copy" } }
  // A plain call or e-mail link (tel:, or mailto: without a prepared e-mail).
  | { name: "Call Click" | "Email Click"; props: { place: string } };

export function trackEvent(event: AnalyticsEvent) {
  track(event.name, event.props);
}

// Call and e-mail links are all over the site (header menu, footer, contact
// page, status card...), so they're counted with one listener instead of a
// handler on each: the place comes from the nearest data-analytics-place.
// mailto: links with a prepared e-mail (a "?subject=...") are the booking's
// own and are counted as booking events instead.
function trackContactLink(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
  if (!link) return;
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("mailto:") && href.includes("?")) return;
  const place = link.closest<HTMLElement>("[data-analytics-place]")?.dataset.analyticsPlace ?? "other";
  trackEvent({ name: href.startsWith("tel:") ? "Call Click" : "Email Click", props: { place } });
}

let started = false;

export function startAnalytics() {
  inject({ framework: "vike" });
  if (started) return;
  started = true;
  document.addEventListener("click", trackContactLink, { capture: true });
}
