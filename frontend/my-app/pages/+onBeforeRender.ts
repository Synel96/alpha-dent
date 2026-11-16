export { onBeforeRender };

import type { PageContextServer } from "vike/types";
import { translationsFor } from "../lib/i18n/resources";

// Server-side only (the default for onBeforeRender): looks up the page's
// locale's strings, for the server render (pages/+Wrapper.tsx) and for the
// copy in the HTML that the browser starts from (pages/+Head.tsx). Not in
// passToClient - client-side navigation stays within one locale, whose
// strings the browser already has.
function onBeforeRender(pageContext: PageContextServer) {
  return {
    pageContext: {
      translations: translationsFor(pageContext.locale),
    },
  };
}
