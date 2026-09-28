import ROUTE_SLUGS from "./route-slugs.json";

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

type RouteSlugs = Record<string, Record<Locale, string>>;
const SLUGS: RouteSlugs = ROUTE_SLUGS;

// Logical pathname of every real page: the Hungarian filesystem route under
// pages/ (e.g. "/kapcsolat"). Public URLs are always locale-prefixed and use
// each language's own slug (e.g. "/de/kontakt"), see lib/route-slugs.json.
export const PAGE_PATHNAMES = Object.keys(SLUGS);

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function stripTrailingSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/**
 * Maps a public URL pathname to its locale and logical (filesystem) pathname.
 * Unprefixed paths still resolve as Hungarian: Vike's page discovery probes
 * pages at their bare filesystem path, so those must keep routing, even
 * though they're never linked and only reachable via a redirect in production.
 */
export function extractLocale(pathname: string): {
  locale: Locale;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/");
  const first = segments[1];

  if (!isLocale(first)) {
    return { locale: DEFAULT_LOCALE, pathnameWithoutLocale: pathname };
  }

  const slug = stripTrailingSlash("/" + segments.slice(2).join("/"));
  const logical = Object.keys(SLUGS).find((page) => SLUGS[page][first] === slug);
  return { locale: first, pathnameWithoutLocale: logical ?? slug };
}

export function localizeHref(locale: Locale, pathname: string): string {
  const slug = SLUGS[pathname]?.[locale] ?? pathname;
  return `/${locale}${slug === "/" ? "" : slug}`;
}
