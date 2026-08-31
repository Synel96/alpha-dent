// Single source of truth for the clinic's real-world company data:
// legal identity, address, contact details, and geo coordinates.
// Used both for on-page display (contact page) and for the schema.org
// structured data emitted in pages/+Head.tsx.
export const COMPANY_INFO = {
  legalName: "Alphadent Kft.",
  brandName: "Alpha Dent",
  address: "9400 Sopron, Arany Janos u. 13.",
  addressComponents: {
    streetAddress: "Arany Janos u. 13.",
    postalCode: "9400",
    addressLocality: "Sopron",
    addressCountry: "HU",
  },
  mapUrl: "https://goo.gl/maps/tBZd2pfrPTJkpJVb6",
  mobileDisplay: "+36 20 80 80 600",
  mobileHref: "tel:+36208080600",
  phoneMainDisplay: "+36 99 788 888",
  phoneMainHref: "tel:+3699788888",
  phoneAltDisplay: "+36 99 340 707",
  phoneAltHref: "tel:+3699340707",
  email: "info@alpha-dent.eu",
  emailHref: "mailto:info@alpha-dent.eu",
  gps: "47.6777786, 16.5896789",
  geo: {
    latitude: 47.6777786,
    longitude: 16.5896789,
  },
  gpsMapUrl: "https://www.google.com/maps?q=47.6777786,16.5896789",
  websiteUrl: "https://alpha-dent.eu/hu/",
  openingHours: {
    weekdays: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    closedDays: ["Saturday", "Sunday"],
  },
} as const;
