import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { commonResources } from "./i18n/common";
import { contactResources } from "./i18n/contact";
import { errorResources } from "./i18n/error";
import { faqResources } from "./i18n/faq";

const isBrowser = typeof window !== "undefined";

const resources = {
  hu: {
    translation: {
      ...commonResources.hu,
      ...errorResources.hu,
      ...contactResources.hu,
      ...faqResources.hu,
    },
  },
  en: {
    translation: {
      ...commonResources.en,
      ...errorResources.en,
      ...contactResources.en,
      ...faqResources.en,
    },
  },
  de: {
    translation: {
      ...commonResources.de,
      ...errorResources.de,
      ...contactResources.de,
      ...faqResources.de,
    },
  },
  it: {
    translation: {
      ...commonResources.it,
      ...errorResources.it,
      ...contactResources.it,
      ...faqResources.it,
    },
  },
} as const;

if (!i18n.isInitialized) {
  if (isBrowser) {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "hu",
    lng: "hu",
    initImmediate: false,
    supportedLngs: ["hu", "en", "de", "it"],
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });
}

export default i18n;
