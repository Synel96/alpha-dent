export { Wrapper };

import React from "react";
import { I18nextProvider } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import i18n, { createRequestI18n } from "../lib/i18n";

function Wrapper({ children }: { children: React.ReactNode }) {
  const { locale } = usePageContext();

  // See lib/i18n.ts: isolate each server render onto its own i18next
  // instance so concurrent prerenders can't leak locale state into each
  // other.
  if (typeof window === "undefined") {
    return (
      <I18nextProvider i18n={createRequestI18n(locale)}>{children}</I18nextProvider>
    );
  }

  // Client: only one page is ever active, so the shared singleton is safe -
  // but it still needs to be wrapped in the same Provider shape as the
  // server (rather than left ambient) and corrected to the right locale
  // here, at the outermost point, before Layout or the page itself ever
  // call useTranslation().
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
