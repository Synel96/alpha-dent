import { inject } from "@vercel/analytics";

// Vercel Web Analytics: cookieless visitor statistics (no data stored on the
// device, so no consent banner) - see section 3.5 of lib/privacy-policy.ts.
// The script is served from this site (/_vercel/insights/script.js), so the
// CSP's script-src/connect-src 'self' already allow it, and it follows the
// client-side page changes by itself. Counted only once Web Analytics is
// enabled for the project on Vercel; locally the script simply isn't there.
export function startAnalytics() {
  inject({ framework: "vike" });
}
