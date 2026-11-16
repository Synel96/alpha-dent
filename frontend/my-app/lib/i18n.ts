import i18n, { type InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locale";

// Translations are not bundled here: a page only ever needs its own locale's
// strings, so the prerender writes exactly those into the page's HTML (see
// pages/+Head.tsx and pages/+onBeforeRender.ts), and the browser reads them
// back from there before the first render. The other three languages are
// never downloaded. Switching language is a full page load for the same
// reason (components/ui/language-switcher.tsx).

export type Translation = Record<string, unknown>;

// The id of the <script type="application/json"> that carries them. A JSON
// script is data, not code, so the CSP (script-src 'self') allows it.
export const TRANSLATIONS_ELEMENT_ID = "i18n-translations";

export type EmbeddedTranslations = { locale: Locale; translation: Translation };

const OPTIONS: InitOptions = {
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALES,
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  // Resources are given up front, so init is synchronous: the first render
  // (and hydration) already has every string.
  initAsync: false,
};

export function addTranslations(locale: Locale, translation: Translation) {
  i18n.addResourceBundle(locale, "translation", translation, true, true);
}

function readEmbeddedTranslations(): EmbeddedTranslations | null {
  if (typeof document === "undefined") return null;
  const element = document.getElementById(TRANSLATIONS_ELEMENT_ID);
  if (!element?.textContent) return null;
  return JSON.parse(element.textContent) as EmbeddedTranslations;
}

if (!i18n.isInitialized) {
  // The active language is driven by the URL locale prefix (see
  // pages/+onBeforeRoute.ts), not by browser detection or localStorage.
  // pages/+Wrapper.tsx and pages/+Layout.tsx keep i18n on pageContext.locale.
  const embedded = readEmbeddedTranslations();
  i18n.use(initReactI18next).init({
    ...OPTIONS,
    resources: embedded ? { [embedded.locale]: { translation: embedded.translation } } : {},
    lng: embedded?.locale ?? DEFAULT_LOCALE,
  });
}

// Vike's prerender step can render many pages concurrently in the same
// Node process, so every *server* render gets its own isolated instance
// (pages/+Wrapper.tsx) with just its page's locale - a shared, mutable
// instance would let page A's locale leak into page B's HTML. The client
// keeps using the shared singleton above, which is safe since only one page
// is ever active there.
export function createRequestI18n(locale: Locale, translation: Translation) {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    ...OPTIONS,
    resources: { [locale]: { translation } },
    lng: locale,
  });
  return instance;
}

export default i18n;
