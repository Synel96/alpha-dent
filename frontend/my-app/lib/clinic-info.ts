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

// The operating company, for the privacy notice (and its "service provider"
// block, which doubles as the site's legal imprint). Fields left null are
// simply not shown on the page - fill them in from the company register
// (e-cegjegyzek.hu) when available.
export const COMPANY = {
  legalName: "Alphadent Kft.",
  // Registered seat, as in the company register.
  registeredSeat: "9400 Sopron, Arany J. utca 13." as string | null,
  // Cégjegyzékszám.
  companyRegistrationNumber: "08-09-017400" as string | null,
  // Adószám.
  taxNumber: "14027493-2-08" as string | null,
  // Name of the managing director (ügyvezető).
  representative: null as string | null,
  // Data protection officer's contact, only if one has been appointed.
  dataProtectionOfficer: null as string | null,
  // Healthcare operating licence: number and issuing authority.
  operatingLicence: null as string | null,
};

// Date the current privacy notice takes effect (YYYY-MM-DD).
export const PRIVACY_POLICY_EFFECTIVE_DATE = "2026-10-06";
