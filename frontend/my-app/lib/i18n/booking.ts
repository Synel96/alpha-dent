// The appointment request e-mail the "Időpontot kérek" buttons open (see
// lib/use-booking-mailto.ts). {{service}} is the treatment on a service
// page, empty elsewhere.
export const bookingResources = {
  hu: {
    booking: {
      subject: "Időpontkérés",
      body: "Tisztelt Alphadent!\n\nIdőpontot szeretnék kérni.\n\nNév: \nTelefonszám: \nKezelés: {{service}}\nMikor lenne alkalmas (nap, napszak): \n\nKöszönöm!",
    },
  },
  en: {
    booking: {
      subject: "Appointment request",
      body: "Dear Alphadent team,\n\nI would like to book an appointment.\n\nName: \nPhone number: \nTreatment: {{service}}\nPreferred day and time: \n\nThank you!",
    },
  },
  de: {
    booking: {
      subject: "Terminanfrage",
      body: "Sehr geehrtes Alphadent-Team,\n\nich möchte gerne einen Termin vereinbaren.\n\nName: \nTelefonnummer: \nBehandlung: {{service}}\nWunschtermin (Tag, Tageszeit): \n\nVielen Dank!",
    },
  },
  it: {
    booking: {
      subject: "Richiesta di appuntamento",
      body: "Gentile team Alphadent,\n\nvorrei fissare un appuntamento.\n\nNome: \nNumero di telefono: \nTrattamento: {{service}}\nGiorno e orario preferiti: \n\nGrazie!",
    },
  },
};
