export const LOCALES = ["hu", "en", "de", "it"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "hu";

declare global {
  namespace Vike {
    interface PageContext {
      locale: Locale;
    }
  }
}

/**
 * The default locale has no URL prefix (e.g. `/kapcsolat`); every other
 * locale is prefixed (e.g. `/en/kapcsolat`). This mirrors Vike's official
 * i18n pattern, which keeps prerendering/routing well-defined: unprefixed
 * URLs must always resolve to a real page, since Vike's filesystem-based
 * page discovery (and the prerender crawl) probes pages at their bare path
 * before any prefix is known.
 */
export function extractLocale(pathname: string): {
  locale: Locale;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/");
  const first = segments[1];

  if ((LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE) {
    return {
      locale: first as Locale,
      pathnameWithoutLocale: "/" + segments.slice(2).join("/"),
    };
  }

  return { locale: DEFAULT_LOCALE, pathnameWithoutLocale: pathname };
}

export function localizeHref(locale: Locale, pathname: string): string {
  if (locale === DEFAULT_LOCALE) return pathname;
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

// Logical (locale-less) pathname of every real page, kept in sync by hand
// with pages/*/+Page.tsx. Used by the sitemap generator.
export const PAGE_PATHNAMES = [
  "/",
  "/klinikank",
  "/szolgaltatasaink",
  "/tortenetunk",
  "/kerdesek",
  "/kapcsolat",
] as const;
