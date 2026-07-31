import { LOCALES, localizeHref, type Locale } from "./locale";

// The production domain, taken from the CONTACT_INFO.websiteUrl already
// referenced in pages/kapcsolat/+Page.tsx. Update this if the final domain
// for this project differs.
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
