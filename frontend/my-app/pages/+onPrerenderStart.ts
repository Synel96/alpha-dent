export { onPrerenderStart };

import type { PageContextServer } from "vike/types";
import { DEFAULT_LOCALE, LOCALES } from "../lib/locale";

// Duplicate every statically-discovered page across all locales so each
// gets its own prerendered HTML file. https://vike.dev/i18n#pre-rendering
function onPrerenderStart(prerenderContext: { pageContexts: PageContextServer[] }) {
  const pageContexts = prerenderContext.pageContexts.flatMap((pageContext) =>
    LOCALES.map((locale) => ({
      ...pageContext,
      urlOriginal:
        locale === DEFAULT_LOCALE
          ? pageContext.urlOriginal
          : `/${locale}${pageContext.urlOriginal === "/" ? "" : pageContext.urlOriginal}`,
      locale,
    }))
  );

  return {
    prerenderContext: {
      pageContexts,
    },
  };
}
