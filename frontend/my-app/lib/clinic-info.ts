// The clinic's name, address and contact details in one place: the
// structured data (lib/structured-data.ts) and the contact page both read
// from here, so what Google's local results see always matches what the
// page shows (and what the Google Business Profile should say too).
export const CLINIC = {
  name: "Alphadent",
  streetAddress: "Arany János u. 13.",
  postalCode: "9400",
  city: "Sopron",
  countryCode: "HU",
  latitude: 47.6777786,
  longitude: 16.5896789,
  mapUrl: "https://goo.gl/maps/tBZd2pfrPTJkpJVb6",
  phoneDisplay: "+36 20 80 80 600",
  phoneE164: "+36208080600",
  email: "info@alpha-dent.eu",
  foundingYear: 1996,
  // Canonical profile URLs (no share-tracking query string).
  socialProfiles: [
    "https://www.instagram.com/alphadent_eu",
    "https://www.facebook.com/profile.php?id=61589184814755",
  ],
  // Share/preview image: the homepage hero photo.
  image: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp",
} as const;

export const CLINIC_ADDRESS_LINE = `${CLINIC.postalCode} ${CLINIC.city}, ${CLINIC.streetAddress}`;
