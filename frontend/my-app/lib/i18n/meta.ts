// Per-page <title> and meta description, per locale. Titles lead with the
// treatment + "Sopron" (what people actually search for) and end with the
// brand; descriptions stay under ~160 characters so Google shows them whole.
// Read by each page's +title.ts / +description.ts through pageMeta().

export type MetaPage =
  | "home"
  | "clinic"
  | "services"
  | "implantologia"
  | "szajsebeszet"
  | "esztetikaiFogaszat"
  | "fogmegtartoKezelesek"
  | "gallery"
  | "faq"
  | "contact"
  | "privacy";

type PageMeta = { title: string; description: string };

export const metaResources = {
  hu: {
    meta: {
      pages: {
        home: {
          title: "Alphadent Fogászati Klinika Sopron | Implantológia, Szájsebészet",
          description:
            "Fogászati klinika Sopronban 1996 óta: implantológia, szájsebészet, esztétikai fogászat és saját fogtechnikai labor. CAMLOG arany referenciarendelő.",
        },
        clinic: {
          title: "Fogászati klinikánk Sopronban – rendelő és labor | Alphadent",
          description:
            "Ismerje meg soproni fogászati klinikánkat: modern rendelő és saját CAD/CAM fogtechnikai labor 1996 óta, CAMLOG arany referenciarendelő az implantológiában.",
        },
        services: {
          title: "Fogászati szolgáltatások Sopronban | Alphadent",
          description:
            "Implantológia, szájsebészet, esztétikai fogászat és fogmegtartó kezelések egy helyen Sopronban, személyre szabott kezelési tervvel és saját laborral.",
        },
        implantologia: {
          title: "Implantológia, fogimplantátum Sopronban | Alphadent",
          description:
            "Fogimplantátum Sopronban egy hiányzó fogtól a teljes fogsorig. CAMLOG arany referenciarendelő, cirkónia implantátumok, saját labor. Kérjen időpontot!",
        },
        szajsebeszet: {
          title: "Szájsebészet Sopronban – foghúzás, bölcsességfog | Alphadent",
          description:
            "Szájsebészet Sopronban: foghúzás, bölcsességfog-eltávolítás, gyökércsúcs-amputáció, csontpótlás, sinus lift. Kíméletes kezelés, alapos érzéstelenítés.",
        },
        esztetikaiFogaszat: {
          title: "Esztétikai fogászat Sopronban – korona, fehérítés | Alphadent",
          description:
            "Esztétikai fogászat Sopronban: kerámia és cirkónium koronák, hidak, inlay, onlay, fogfehérítés. Természetes mosoly, saját fogtechnikai laborunkból.",
        },
        fogmegtartoKezelesek: {
          title: "Tömés és gyökérkezelés Sopronban | Alphadent",
          description:
            "Fogmegtartó kezelések Sopronban: esztétikus tömés, inlay, onlay és korszerű gépi gyökérkezelés, hogy saját foga minél tovább megmaradjon.",
        },
        gallery: {
          title: "Galéria – fogászati rendelő és labor Sopronban | Alphadent",
          description:
            "Fotók az Alphadent soproni fogászati rendelőjéről és saját fogtechnikai laborjáról: kezelők, váró és a fogpótlások készítése közelről.",
        },
        faq: {
          title: "Gyakori kérdések – fogászat Sopronban | Alphadent",
          description:
            "Válaszok a leggyakoribb kérdésekre a kezelésekről, a kezelési tervről és az árajánlatról. Alphadent fogászati klinika, Sopron.",
        },
        contact: {
          title: "Kapcsolat – fogászat Sopron, Arany János u. 13. | Alphadent",
          description:
            "Alphadent fogászat: 9400 Sopron, Arany János u. 13. Telefon: +36 20 80 80 600, e-mail: info@alpha-dent.eu. Nyitva hétfőtől péntekig 8–17 óráig.",
        },
        privacy: {
          title: "Adatkezelési tájékoztató | Alphadent",
          description:
            "Az Alphadent soproni fogászati klinika adatkezelési tájékoztatója: hogyan kezeljük a személyes adatokat a weboldal használata során.",
        },
      },
    },
  },
  en: {
    meta: {
      pages: {
        home: {
          title: "Alphadent Dental Clinic Sopron, Hungary | Implants & Oral Surgery",
          description:
            "Dental clinic in Sopron, Hungary since 1996: implants, oral surgery, cosmetic dentistry and our own dental lab. CAMLOG Gold reference clinic.",
        },
        clinic: {
          title: "Our Dental Clinic in Sopron, Hungary – Practice & Lab | Alphadent",
          description:
            "Get to know our dental clinic in Sopron: a modern practice and our own CAD/CAM dental lab since 1996, and a CAMLOG Gold reference clinic for implants.",
        },
        services: {
          title: "Dental Treatments in Sopron, Hungary | Alphadent",
          description:
            "Implants, oral surgery, cosmetic dentistry and tooth-preserving treatments in one place in Sopron, with a personal treatment plan and our own lab.",
        },
        implantologia: {
          title: "Dental Implants in Sopron, Hungary | Alphadent",
          description:
            "Dental implants in Sopron, Hungary, from a single tooth to a full arch. CAMLOG Gold reference clinic, zirconia implants, in-house lab. Book a consultation.",
        },
        szajsebeszet: {
          title: "Oral Surgery in Sopron – Extractions, Wisdom Teeth | Alphadent",
          description:
            "Oral surgery in Sopron: extractions, wisdom tooth removal, apicoectomy, bone grafting and sinus lift. Gentle care with thorough local anaesthesia.",
        },
        esztetikaiFogaszat: {
          title: "Cosmetic Dentistry in Sopron – Crowns, Whitening | Alphadent",
          description:
            "Cosmetic dentistry in Sopron: ceramic and zirconia crowns, bridges, inlays, onlays and teeth whitening, made in our own dental lab for a natural smile.",
        },
        fogmegtartoKezelesek: {
          title: "Fillings & Root Canal Treatment in Sopron | Alphadent",
          description:
            "Tooth-preserving treatment in Sopron: tooth-coloured fillings, inlays, onlays and modern machine root canal treatment to keep your own teeth longer.",
        },
        gallery: {
          title: "Gallery – Dental Clinic & Lab in Sopron | Alphadent",
          description:
            "Photos of the Alphadent dental clinic in Sopron and its own dental lab: treatment rooms, waiting room and how restorations are made, up close.",
        },
        faq: {
          title: "FAQ – Dental Care in Sopron, Hungary | Alphadent",
          description:
            "Answers to the most common questions about our treatments, treatment plans and quotes. Alphadent dental clinic, Sopron, Hungary.",
        },
        contact: {
          title: "Contact – Dentist in Sopron, Arany János u. 13. | Alphadent",
          description:
            "Alphadent dental clinic: 9400 Sopron, Arany János u. 13., Hungary. Phone: +36 20 80 80 600, e-mail: info@alpha-dent.eu. Open Monday–Friday, 8am–5pm.",
        },
        privacy: {
          title: "Privacy Policy | Alphadent",
          description:
            "Privacy policy of the Alphadent dental clinic in Sopron: how we handle personal data when you use this website.",
        },
      },
    },
  },
  de: {
    meta: {
      pages: {
        home: {
          title: "Alphadent Zahnklinik Sopron, Ungarn | Implantate & Oralchirurgie",
          description:
            "Zahnklinik in Sopron, Ungarn, seit 1996: Implantologie, Oralchirurgie, ästhetische Zahnmedizin und eigenes Dentallabor. CAMLOG Gold-Referenzpraxis.",
        },
        clinic: {
          title: "Unsere Zahnklinik in Sopron, Ungarn – Praxis & Labor | Alphadent",
          description:
            "Lernen Sie unsere Zahnklinik in Sopron kennen: moderne Praxis und eigenes CAD/CAM-Dentallabor seit 1996, CAMLOG Gold-Referenzpraxis für Implantologie.",
        },
        services: {
          title: "Zahnbehandlungen in Sopron, Ungarn | Alphadent",
          description:
            "Implantologie, Oralchirurgie, ästhetische Zahnmedizin und Zahnerhaltung in Sopron – mit persönlichem Behandlungsplan und eigenem Dentallabor.",
        },
        implantologia: {
          title: "Zahnimplantate in Sopron, Ungarn | Alphadent",
          description:
            "Zahnimplantate in Sopron, Ungarn – vom Einzelzahn bis zur Vollversorgung. CAMLOG Gold-Referenzpraxis, Zirkonimplantate, eigenes Labor.",
        },
        szajsebeszet: {
          title: "Oralchirurgie in Sopron – Weisheitszähne & mehr | Alphadent",
          description:
            "Oralchirurgie in Sopron: Zahnextraktion, Weisheitszahnentfernung, Wurzelspitzenresektion, Knochenaufbau und Sinuslift – schonend und gut betäubt.",
        },
        esztetikaiFogaszat: {
          title: "Ästhetische Zahnmedizin in Sopron – Kronen, Bleaching | Alphadent",
          description:
            "Ästhetische Zahnmedizin in Sopron: Keramik- und Zirkonkronen, Brücken, Inlays, Onlays und Bleaching – aus unserem eigenen Dentallabor.",
        },
        fogmegtartoKezelesek: {
          title: "Füllungen & Wurzelbehandlung in Sopron | Alphadent",
          description:
            "Zahnerhaltung in Sopron: zahnfarbene Füllungen, Inlays, Onlays und moderne maschinelle Wurzelbehandlung, damit Ihre eigenen Zähne länger bleiben.",
        },
        gallery: {
          title: "Galerie – Zahnklinik & Labor in Sopron | Alphadent",
          description:
            "Fotos der Alphadent Zahnklinik in Sopron und ihres eigenen Dentallabors: Behandlungsräume, Wartezimmer und die Herstellung von Zahnersatz aus der Nähe.",
        },
        faq: {
          title: "FAQ – Zahnarzt in Sopron, Ungarn | Alphadent",
          description:
            "Antworten auf die häufigsten Fragen zu Behandlungen, Behandlungsplan und Kostenvoranschlag. Alphadent Zahnklinik, Sopron, Ungarn.",
        },
        contact: {
          title: "Kontakt – Zahnarzt in Sopron, Arany János u. 13. | Alphadent",
          description:
            "Alphadent Zahnklinik: 9400 Sopron, Arany János u. 13., Ungarn. Telefon: +36 20 80 80 600, E-Mail: info@alpha-dent.eu. Geöffnet Mo–Fr 8–17 Uhr.",
        },
        privacy: {
          title: "Datenschutzerklärung | Alphadent",
          description:
            "Datenschutzerklärung der Alphadent Zahnklinik in Sopron: wie wir personenbezogene Daten bei der Nutzung dieser Website verarbeiten.",
        },
      },
    },
  },
  it: {
    meta: {
      pages: {
        home: {
          title: "Alphadent Clinica Dentale Sopron, Ungheria | Impianti e Chirurgia",
          description:
            "Clinica dentale a Sopron, Ungheria, dal 1996: implantologia, chirurgia orale, odontoiatria estetica e laboratorio interno. Centro CAMLOG Gold.",
        },
        clinic: {
          title: "La nostra clinica dentale a Sopron – studio e laboratorio | Alphadent",
          description:
            "Scopri la nostra clinica dentale a Sopron: studio moderno e laboratorio odontotecnico CAD/CAM interno dal 1996, centro di riferimento CAMLOG Gold.",
        },
        services: {
          title: "Trattamenti dentali a Sopron, Ungheria | Alphadent",
          description:
            "Implantologia, chirurgia orale, odontoiatria estetica e conservativa in un unico posto a Sopron, con piano di cura personalizzato e laboratorio interno.",
        },
        implantologia: {
          title: "Impianti dentali a Sopron, Ungheria | Alphadent",
          description:
            "Impianti dentali a Sopron, Ungheria: da un singolo dente all'arcata completa. Centro CAMLOG Gold, impianti in zirconia, laboratorio interno.",
        },
        szajsebeszet: {
          title: "Chirurgia orale a Sopron – estrazioni, denti del giudizio | Alphadent",
          description:
            "Chirurgia orale a Sopron: estrazioni, denti del giudizio, apicectomia, innesti ossei e rialzo del seno mascellare. Cure delicate con anestesia accurata.",
        },
        esztetikaiFogaszat: {
          title: "Odontoiatria estetica a Sopron – corone, sbiancamento | Alphadent",
          description:
            "Odontoiatria estetica a Sopron: corone in ceramica e zirconia, ponti, intarsi e sbiancamento, realizzati nel nostro laboratorio per un sorriso naturale.",
        },
        fogmegtartoKezelesek: {
          title: "Otturazioni e devitalizzazione a Sopron | Alphadent",
          description:
            "Conservativa a Sopron: otturazioni estetiche, intarsi e moderna devitalizzazione meccanica, per conservare più a lungo i propri denti.",
        },
        gallery: {
          title: "Galleria – studio e laboratorio a Sopron | Alphadent",
          description:
            "Foto dello studio dentistico Alphadent di Sopron e del suo laboratorio odontotecnico: sale di trattamento, sala d'attesa e la realizzazione delle protesi.",
        },
        faq: {
          title: "Domande frequenti – dentista a Sopron | Alphadent",
          description:
            "Risposte alle domande più frequenti su trattamenti, piano di cura e preventivo. Clinica dentale Alphadent, Sopron, Ungheria.",
        },
        contact: {
          title: "Contatti – dentista a Sopron, Arany János u. 13. | Alphadent",
          description:
            "Clinica dentale Alphadent: 9400 Sopron, Arany János u. 13., Ungheria. Telefono: +36 20 80 80 600, e-mail: info@alpha-dent.eu. Aperti lun–ven 8–17.",
        },
        privacy: {
          title: "Informativa sulla privacy | Alphadent",
          description:
            "Informativa sulla privacy della clinica dentale Alphadent di Sopron: come trattiamo i dati personali durante l'uso di questo sito.",
        },
      },
    },
  },
} as const satisfies Record<string, { meta: { pages: Record<MetaPage, PageMeta> } }>;

export function pageMeta(locale: keyof typeof metaResources, page: MetaPage): PageMeta {
  return metaResources[locale].meta.pages[page];
}
