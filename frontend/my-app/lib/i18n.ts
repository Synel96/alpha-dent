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
      error: {
        404: {
          title: "Az oldal nem található",
          description: "A keresett oldal nem létezik vagy áthelyezésre került.",
        },
        500: {
          title: "Szerverhiba",
          description: "Valami hiba történt a szerveren. Kérjük, próbáld újra később.",
        },
        generic: {
          title: "Váratlan hiba",
          description: "Valami nem várt dolog történt. Kérjük, próbáld újra.",
        },
        backHome: "Vissza a főoldalra",
        errorCode: "Hibakód",
      },
      contactPage: {
        eyebrow: "Kapcsolat",
        title: "Lépj velünk kapcsolatba",
        intro:
          "Időpontfoglalás, kérdések vagy további információ esetén elérsz minket telefonon, emailben és térképes útvonalon is.",
        imageAlt: "Alphadent logó",
        cards: {
          address: "Címünk",
          mobile: "Mobil",
          phone: "Telefon",
          email: "Email",
          gps: "GPS koordináták",
        },
        actions: {
          openMap: "Megnyitás térképen",
          callNow: "Hívás most",
          sendEmail: "Email küldése",
          openByGps: "Navigáció GPS alapján",
          openWebsite: "Honlap megnyitása",
        },
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
      error: {
        404: {
          title: "Page not found",
          description: "The page you're looking for doesn't exist or has been moved.",
        },
        500: {
          title: "Server error",
          description: "Something went wrong on our end. Please try again later.",
        },
        generic: {
          title: "Unexpected error",
          description: "Something unexpected happened. Please try again.",
        },
        backHome: "Back to home",
        errorCode: "Error code",
      },
      contactPage: {
        eyebrow: "Contact",
        title: "Get in touch with us",
        intro:
          "For appointments, questions, or further details, you can reach us by phone, email, or map navigation.",
        imageAlt: "Alphadent logo",
        cards: {
          address: "Address",
          mobile: "Mobile",
          phone: "Phone",
          email: "Email",
          gps: "GPS coordinates",
        },
        actions: {
          openMap: "Open in maps",
          callNow: "Call now",
          sendEmail: "Send email",
          openByGps: "Navigate by GPS",
          openWebsite: "Open website",
        },
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
      error: {
        404: {
          title: "Seite nicht gefunden",
          description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
        },
        500: {
          title: "Serverfehler",
          description: "Auf unserer Seite ist etwas schiefgelaufen. Bitte versuche es später erneut.",
        },
        generic: {
          title: "Unerwarteter Fehler",
          description: "Etwas Unerwartetes ist passiert. Bitte versuche es erneut.",
        },
        backHome: "Zurück zur Startseite",
        errorCode: "Fehlercode",
      },
      contactPage: {
        eyebrow: "Kontakt",
        title: "Nimm Kontakt mit uns auf",
        intro:
          "Für Termine, Fragen oder weitere Informationen erreichst du uns per Telefon, Email oder Karten-Navigation.",
        imageAlt: "Alphadent Logo",
        cards: {
          address: "Unsere Adresse",
          mobile: "Mobil",
          phone: "Telefon",
          email: "Email",
          gps: "GPS-Koordinaten",
        },
        actions: {
          openMap: "In Karten öffnen",
          callNow: "Jetzt anrufen",
          sendEmail: "Email senden",
          openByGps: "Mit GPS navigieren",
          openWebsite: "Website öffnen",
        },
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
      error: {
        404: {
          title: "Pagina non trovata",
          description: "La pagina che stai cercando non esiste o è stata spostata.",
        },
        500: {
          title: "Errore del server",
          description: "Qualcosa è andato storto sul nostro server. Riprova più tardi.",
        },
        generic: {
          title: "Errore imprevisto",
          description: "Qualcosa di imprevisto è successo. Per favore riprova.",
        },
        backHome: "Torna alla home",
        errorCode: "Codice errore",
      },
      contactPage: {
        eyebrow: "Contatti",
        title: "Mettiti in contatto con noi",
        intro:
          "Per appuntamenti, domande o maggiori informazioni, puoi contattarci via telefono, email o navigazione su mappa.",
        imageAlt: "Logo Alphadent",
        cards: {
          address: "Il nostro indirizzo",
          mobile: "Cellulare",
          phone: "Telefono",
          email: "Email",
          gps: "Coordinate GPS",
        },
        actions: {
          openMap: "Apri in mappa",
          callNow: "Chiama ora",
          sendEmail: "Invia email",
          openByGps: "Naviga con GPS",
          openWebsite: "Apri il sito",
        },
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
