import { CLINIC } from "./clinic-info";

// The "Időpontot kérek" buttons open the visitor's mail app with an
// appointment request to the clinic already written (booking.* in
// lib/i18n/booking.ts): no form, no backend - the visitor fills in the
// blanks and presses send.
export function bookingMailto(subject: string, body: string): string {
  // CRLF line breaks, as RFC 6068 asks for in a mailto: body.
  const crlfBody = body.replace(/\r?\n/g, "\r\n");
  return `mailto:${CLINIC.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlfBody)}`;
}

// Web mail compose pages with the same e-mail filled in, for computers -
// where most people use webmail and a mailto: link often opens nothing.
export function bookingWebmailLinks(subject: string, body: string): { gmail: string; outlook: string } {
  const to = encodeURIComponent(CLINIC.email);
  const su = encodeURIComponent(subject);
  const text = encodeURIComponent(body.replace(/\r?\n/g, "\r\n"));
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${text}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${text}`,
  };
}

// A computer (mouse or touchpad) rather than a phone or tablet: there the
// modal offers mail app / Gmail / Outlook.com / copy instead of opening the
// mail app straight away.
export function isDesktopPointer(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

// The modal's message, signed with the name and phone number the visitor
// gave in their own fields.
export function signedBookingMessage(message: string, name: string, phone: string, phoneLabel: string): string {
  return `${message.trimEnd()}\n\n${name.trim()}\n${phoneLabel}: ${phone.trim()}`;
}

// Kept apart so tests can stub it: jsdom can't follow a mailto: navigation.
export function openMailto(href: string) {
  window.location.href = href;
}
