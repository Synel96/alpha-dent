// The appointment request modal and e-mail behind the "Időpontot kérek"
// buttons (see components/ui/booking-dialog.tsx). {{service}} is the
// treatment on a service page, empty elsewhere. `body` is the whole e-mail
// the buttons' plain mailto: link opens (no JavaScript); `message` is the
// modal's template, without the name and phone lines - the modal asks for
// those in their own fields and (if the visitor leaves it ticked) signs the
// e-mail with them.
export const bookingResources = {
  hu: {
    booking: {
      subject: "Időpontkérés",
      body: "Tisztelt Alphadent!\n\nIdőpontot szeretnék kérni.\n\nNév: \nTelefonszám: \nKezelés: {{service}}\nMikor lenne alkalmas (nap, napszak): \n\nKöszönöm!",
      message: "Tisztelt Alphadent!\n\nIdőpontot szeretnék kérni.\n\nKezelés: {{service}}\nMikor lenne alkalmas (nap, napszak): \n\nKöszönöm!",
      dialog: {
        name: "Név",
        phone: "Telefonszám",
        includeContact: "Név és telefonszám beillesztése az üzenet végére",
        title: "Időpontkérés",
        intro: "Írja meg nekünk, mikor és milyen kezelésre jönne. A levelet kollégáink munkanapokon hamar megválaszolják.",
        subject: "Tárgy",
        message: "Üzenet",
        hint: "A „Tovább a küldéshez” gomb megnyitja levelezőprogramját ezzel a levéllel – ott már csak a Küldés gombot kell megnyomnia.",
        submit: "Tovább a küldéshez",
        fallback: "Nem nyílt meg a levelező? Hívjon minket vagy írjon:",
        sentTitle: "Megnyílt a levelezője?",
        sentText: "Ellenőrizze a levelet, és nyomja meg a Küldés gombot. Hamarosan visszajelzünk az időponttal kapcsolatban.",
        reopen: "Levelező megnyitása újra",
        edit: "Vissza a szerkesztéshez",
        done: "Kész",
      },
    },
  },
  en: {
    booking: {
      subject: "Appointment request",
      body: "Dear Alphadent team,\n\nI would like to book an appointment.\n\nName: \nPhone number: \nTreatment: {{service}}\nPreferred day and time: \n\nThank you!",
      message: "Dear Alphadent team,\n\nI would like to book an appointment.\n\nTreatment: {{service}}\nPreferred day and time: \n\nThank you!",
      dialog: {
        name: "Name",
        phone: "Phone number",
        includeContact: "Add my name and phone number to the end of the message",
        title: "Appointment request",
        intro: "Tell us when you would like to come and for which treatment. Our team replies to e-mails quickly on working days.",
        subject: "Subject",
        message: "Message",
        hint: "“Continue to send” opens your e-mail app with this message – there you only need to press Send.",
        submit: "Continue to send",
        fallback: "Your e-mail app didn't open? Call or write to us:",
        sentTitle: "Did your e-mail app open?",
        sentText: "Check the e-mail and press Send. We will get back to you about the appointment soon.",
        reopen: "Open e-mail app again",
        edit: "Back to editing",
        done: "Done",
      },
    },
  },
  de: {
    booking: {
      subject: "Terminanfrage",
      body: "Sehr geehrtes Alphadent-Team,\n\nich möchte gerne einen Termin vereinbaren.\n\nName: \nTelefonnummer: \nBehandlung: {{service}}\nWunschtermin (Tag, Tageszeit): \n\nVielen Dank!",
      message: "Sehr geehrtes Alphadent-Team,\n\nich möchte gerne einen Termin vereinbaren.\n\nBehandlung: {{service}}\nWunschtermin (Tag, Tageszeit): \n\nVielen Dank!",
      dialog: {
        name: "Name",
        phone: "Telefonnummer",
        includeContact: "Name und Telefonnummer ans Ende der Nachricht setzen",
        title: "Terminanfrage",
        intro: "Schreiben Sie uns, wann und für welche Behandlung Sie kommen möchten. Unser Team beantwortet E-Mails an Werktagen schnell.",
        subject: "Betreff",
        message: "Nachricht",
        hint: "„Weiter zum Senden“ öffnet Ihr E-Mail-Programm mit dieser Nachricht – dort müssen Sie nur noch auf Senden klicken.",
        submit: "Weiter zum Senden",
        fallback: "Ihr E-Mail-Programm hat sich nicht geöffnet? Rufen Sie uns an oder schreiben Sie uns:",
        sentTitle: "Hat sich Ihr E-Mail-Programm geöffnet?",
        sentText: "Prüfen Sie die E-Mail und klicken Sie auf Senden. Wir melden uns bald wegen des Termins bei Ihnen.",
        reopen: "E-Mail-Programm erneut öffnen",
        edit: "Zurück zur Bearbeitung",
        done: "Fertig",
      },
    },
  },
  it: {
    booking: {
      subject: "Richiesta di appuntamento",
      body: "Gentile team Alphadent,\n\nvorrei fissare un appuntamento.\n\nNome: \nNumero di telefono: \nTrattamento: {{service}}\nGiorno e orario preferiti: \n\nGrazie!",
      message: "Gentile team Alphadent,\n\nvorrei fissare un appuntamento.\n\nTrattamento: {{service}}\nGiorno e orario preferiti: \n\nGrazie!",
      dialog: {
        name: "Nome",
        phone: "Numero di telefono",
        includeContact: "Aggiungi nome e numero di telefono alla fine del messaggio",
        title: "Richiesta di appuntamento",
        intro: "Ci scriva quando e per quale trattamento desidera venire. Il nostro team risponde rapidamente alle e-mail nei giorni lavorativi.",
        subject: "Oggetto",
        message: "Messaggio",
        hint: "«Continua per inviare» apre il suo programma di posta con questo messaggio: lì basta premere Invia.",
        submit: "Continua per inviare",
        fallback: "Il programma di posta non si è aperto? Ci chiami o ci scriva:",
        sentTitle: "Il programma di posta si è aperto?",
        sentText: "Controlli l'e-mail e prema Invia. La ricontatteremo presto per l'appuntamento.",
        reopen: "Apri di nuovo il programma di posta",
        edit: "Torna alla modifica",
        done: "Fatto",
      },
    },
  },
};
