export const errorResources = {
  hu: {
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
  },
  en: {
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
  },
  de: {
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
  },
  it: {
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
  },
} as const;
