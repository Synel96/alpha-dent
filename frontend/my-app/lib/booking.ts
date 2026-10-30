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

// The modal's message, signed with the name and phone number the visitor
// gave in their own fields.
export function signedBookingMessage(message: string, name: string, phone: string, phoneLabel: string): string {
  return `${message.trimEnd()}\n\n${name.trim()}\n${phoneLabel}: ${phone.trim()}`;
}

// Kept apart so tests can stub it: jsdom can't follow a mailto: navigation.
export function openMailto(href: string) {
  window.location.href = href;
}
