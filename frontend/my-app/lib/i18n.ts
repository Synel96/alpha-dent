import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { commonResources } from "./i18n/common";
import { contactResources } from "./i18n/contact";
import { errorResources } from "./i18n/error";
import { faqResources } from "./i18n/faq";

const isBrowser = typeof window !== "undefined";
const supportedLngs = ["hu", "en", "de", "it"] as const;

function normalizeLng(lng: string) {
  return lng.toLowerCase().split("-")[0];
}

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

function syncResourceBundles() {
  for (const lng of supportedLngs) {
    i18n.addResourceBundle(
      lng,
      "translation",
      resources[lng].translation,
      true,
      true
    );
  }
}

function applyPersistedLanguage() {
  if (!isBrowser) return;

  const persisted = window.localStorage.getItem("i18nextLng");
  if (!persisted) return;

  const normalized = normalizeLng(persisted);
  if (
    supportedLngs.includes(normalized as (typeof supportedLngs)[number]) &&
    normalized !== i18n.language
  ) {
    void i18n.changeLanguage(normalized);
  }
}

if (!i18n.isInitialized) {
  if (isBrowser) {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "hu",
    ...(isBrowser ? {} : { lng: "hu" }),
    initImmediate: false,
    supportedLngs,
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

  // On client, keep selected language sticky across route changes and error pages.
  applyPersistedLanguage();
} else {
  // Keep server/client resources in sync across HMR and route-level module loads.
  syncResourceBundles();
  applyPersistedLanguage();
}

export default i18n;
