import { COMPANY_INFO } from "./company";
import { LOCALES, localizeHref, type Locale } from "./locale";

// The production domain, taken from COMPANY_INFO.websiteUrl (lib/company.ts).
// Update this if the final domain for this project differs.
export const SITE_URL = "https://alpha-dent.eu";

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}

export function absoluteLocalizedUrl(locale: Locale, pathnameWithoutLocale: string): string {
  return absoluteUrl(localizeHref(locale, pathnameWithoutLocale));
}

export function hreflangAlternates(pathnameWithoutLocale: string): Array<{
  hreflang: string;
  href: string;
}> {
  return [
    ...LOCALES.map((locale) => ({
      hreflang: locale,
      href: absoluteLocalizedUrl(locale, pathnameWithoutLocale),
    })),
    // x-default: the language-neutral entry point, per Google's hreflang guidance.
    { hreflang: "x-default", href: absoluteUrl(pathnameWithoutLocale) },
  ];
}

// schema.org structured data for the clinic, sourced from COMPANY_INFO so the
// site's contact page and this JSON-LD never drift apart. Fields that aren't
// verifiable from the codebase (opening hours, social profiles, a logo image)
// are intentionally omitted rather than guessed.
export function dentistJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_INFO.brandName,
    legalName: COMPANY_INFO.legalName,
    url: SITE_URL,
    telephone: COMPANY_INFO.phoneMainHref.replace("tel:", ""),
    email: COMPANY_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.addressComponents.streetAddress,
      addressLocality: COMPANY_INFO.addressComponents.addressLocality,
      postalCode: COMPANY_INFO.addressComponents.postalCode,
      addressCountry: COMPANY_INFO.addressComponents.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY_INFO.geo.latitude,
      longitude: COMPANY_INFO.geo.longitude,
    },
    hasMap: COMPANY_INFO.mapUrl,
  };
}
