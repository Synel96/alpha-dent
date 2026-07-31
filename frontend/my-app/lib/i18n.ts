import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { commonResources } from "./i18n/common";
import { contactResources } from "./i18n/contact";
import { errorResources } from "./i18n/error";
import { faqResources } from "./i18n/faq";
import { metaResources } from "./i18n/meta";
import { servicesResources } from "./i18n/services";
import { DEFAULT_LOCALE, LOCALES } from "./locale";

const resources = {
  hu: {
    translation: {
      ...commonResources.hu,
      ...errorResources.hu,
      ...contactResources.hu,
      ...faqResources.hu,
      ...servicesResources.hu,
      ...metaResources.hu,
    },
  },
  en: {
    translation: {
      ...commonResources.en,
      ...errorResources.en,
      ...contactResources.en,
      ...faqResources.en,
      ...servicesResources.en,
      ...metaResources.en,
    },
  },
  de: {
    translation: {
      ...commonResources.de,
      ...errorResources.de,
      ...contactResources.de,
      ...faqResources.de,
      ...servicesResources.de,
      ...metaResources.de,
    },
  },
  it: {
    translation: {
      ...commonResources.it,
      ...errorResources.it,
      ...contactResources.it,
      ...faqResources.it,
      ...servicesResources.it,
      ...metaResources.it,
    },
  },
} as const;

function syncResourceBundles() {
  for (const lng of LOCALES) {
    i18n.addResourceBundle(lng, "translation", resources[lng].translation, true, true);
  }
}

if (!i18n.isInitialized) {
  // The active language is driven by the URL locale prefix (see
  // pages/+onBeforeRoute.ts), not by browser detection or localStorage.
  // pages/+Layout.tsx syncs i18n to pageContext.locale on every render.
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
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
  });
} else {
  // Keep server/client resources in sync across HMR and route-level module loads.
  syncResourceBundles();
}

export default i18n;
