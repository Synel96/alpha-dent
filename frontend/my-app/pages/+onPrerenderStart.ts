export { onPrerenderStart };

import type { PageContextServer } from "vike/types";
import { DEFAULT_LOCALE, LOCALES, localizeHref } from "../lib/locale";

// Duplicate every statically-discovered page across all locales so each
// gets its own prerendered HTML file at its translated URL.
// https://vike.dev/i18n#pre-rendering
// Two pages also keep their bare, Hungarian copy: "/" as a fallback in case
// the root redirect in vercel.json is ever not applied, and the 404 page,
// since Vercel only serves a custom 404.html from the output root.
function onPrerenderStart(prerenderContext: { pageContexts: PageContextServer[] }) {
  const pageContexts = prerenderContext.pageContexts.flatMap((pageContext) => {
    const localized = LOCALES.map((locale) => ({
      ...pageContext,
      urlOriginal: localizeHref(locale, pageContext.urlOriginal),
      locale,
    }));
    const keepBare = pageContext.urlOriginal === "/" || pageContext.is404;
    return keepBare ? [{ ...pageContext, locale: DEFAULT_LOCALE }, ...localized] : localized;
  });

  return {
    prerenderContext: {
      pageContexts,
    },
  };
}
