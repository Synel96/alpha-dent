export { onBeforeRoute };

import { modifyUrl } from "vike/modifyUrl";
import { extractLocale } from "../lib/locale";

function onBeforeRoute(pageContext: { urlParsed: { pathname: string; href: string } }) {
  const url = pageContext.urlParsed;
  const { locale, pathnameWithoutLocale } = extractLocale(url.pathname);
  const urlLogical = modifyUrl(url.href, { pathname: pathnameWithoutLocale });

  return {
    pageContext: {
      locale,
      urlLogical,
    },
  };
}
