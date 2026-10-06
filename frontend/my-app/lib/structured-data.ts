import { CLINIC } from "./clinic-info";
import { contactResources } from "./i18n/contact";
import { pageMeta } from "./i18n/meta";
import { DEFAULT_LOCALE, type Locale } from "./locale";
import { WEEKLY_HOURS } from "./opening-hours";
import { absoluteLocalizedUrl, ogImageUrl, SITE_URL } from "./seo";

const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

// Built from the same WEEKLY_HOURS as the hero's open/closed badge, so the
// two can't disagree. Days with identical hours share one entry.
export function openingHoursSpecification() {
  const groups = new Map<string, { opens: string; closes: string; days: string[] }>();
  WEEKLY_HOURS.forEach((hours, index) => {
    if (!hours) return;
    const [open, close] = hours;
    const key = `${open}-${close}`;
    const group = groups.get(key) ?? { opens: hhmm(open), closes: hhmm(close), days: [] };
    group.days.push(SCHEMA_DAYS[index]);
    groups.set(key, group);
  });
  return [...groups.values()].map(({ opens, closes, days }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  }));
}

// schema.org markup for Google: a Dentist (a LocalBusiness subtype) with
// address, coordinates, phone and opening hours - the data local search
// ("fogászat Sopron", "Zahnarzt Sopron") is matched against - plus the
// WebSite it belongs to.
export function clinicStructuredData(locale: Locale) {
  const clinicId = `${SITE_URL}/#clinic`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": clinicId,
        name: CLINIC.name,
        description: pageMeta(locale, "home").description,
        url: absoluteLocalizedUrl(locale, "/"),
        image: ogImageUrl(),
        telephone: CLINIC.phoneE164,
        email: CLINIC.email,
        foundingDate: String(CLINIC.foundingYear),
        medicalSpecialty: "Dentistry",
        address: {
          "@type": "PostalAddress",
          streetAddress: CLINIC.streetAddress,
          postalCode: CLINIC.postalCode,
          addressLocality: CLINIC.city,
          addressCountry: CLINIC.countryCode,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: CLINIC.latitude,
          longitude: CLINIC.longitude,
        },
        hasMap: CLINIC.mapUrl,
        areaServed: { "@type": "City", name: CLINIC.city },
        openingHoursSpecification: openingHoursSpecification(),
        amenityFeature: {
          "@type": "LocationFeatureSpecification",
          name: contactResources[locale].contactPage.parking,
          value: true,
        },
        sameAs: CLINIC.socialProfiles,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: absoluteLocalizedUrl(DEFAULT_LOCALE, "/"),
        name: CLINIC.name,
        inLanguage: locale,
        publisher: { "@id": clinicId },
      },
    ],
  };
}

// For a <script type="application/ld+json">: escape "<" so no string in the
// data can ever close the script tag early.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
