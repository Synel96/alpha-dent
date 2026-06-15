import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const isBrowser = typeof window !== "undefined";

const resources = {
  hu: {
    translation: {
      nav: {
        home: "Kezdőlap",
        clinic: "Klinikánk",
        services: "Szolgáltatásaink",
        story: "Történetünk",
        faq: "Kérdések",
        contact: "Kapcsolat",
      },
      common: {
        menuOpen: "Menü megnyitása",
      },
      footer: {
        allRightsReserved: "Minden jog fenntartva.",
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        clinic: "Our Clinic",
        services: "Services",
        story: "Our Story",
        faq: "Questions",
        contact: "Contact",
      },
      common: {
        menuOpen: "Open menu",
      },
      footer: {
        allRightsReserved: "All rights reserved.",
      },
    },
  },
  de: {
    translation: {
      nav: {
        home: "Startseite",
        clinic: "Unsere Klinik",
        services: "Dienstleistungen",
        story: "Unsere Geschichte",
        faq: "Häufig gestellte Fragen",
        contact: "Kontakt",
      },
      common: {
        menuOpen: "Menü öffnen",
      },
      footer: {
        allRightsReserved: "Alle Rechte vorbehalten.",
      },
    },
  },
  it: {
    translation: {
      nav: {
        home: "Home",
        clinic: "La nostra clinica",
        services: "Servizi",
        story: "La nostra storia",
        faq: "Domande frequenti",
        contact: "Contatti",
      },
      common: {
        menuOpen: "Apri il menu",
      },
      footer: {
        allRightsReserved: "Tutti i diritti riservati.",
      },
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
