import { CLINIC } from "./clinic-info";
import { cloudinaryUrl } from "./cloudinary";
import { DEFAULT_LOCALE, LOCALES, localizeHref, type Locale } from "./locale";

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
    // x-default: the fallback for unlisted languages. There's no unprefixed
    // page to point at (the root redirects to /hu), so it's the Hungarian URL.
    { hreflang: "x-default", href: absoluteLocalizedUrl(DEFAULT_LOCALE, pathnameWithoutLocale) },
  ];
}

// 1200x630 is the size Facebook/LinkedIn/Messenger previews are cut to; JPG
// rather than f_auto, since not every link-preview crawler takes WebP/AVIF.
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function ogImageUrl(): string {
  return cloudinaryUrl(CLINIC.image, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    format: "jpg",
  });
}

const OG_LOCALES: Record<Locale, string> = { hu: "hu_HU", en: "en_GB", de: "de_DE", it: "it_IT" };

export function ogLocale(locale: Locale): string {
  return OG_LOCALES[locale];
}

export function ogLocaleAlternates(locale: Locale): string[] {
  return LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALES[other]);
}
