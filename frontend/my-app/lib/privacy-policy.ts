import { CLINIC, CLINIC_ADDRESS_LINE, COMPANY } from "./clinic-info";
import type { Locale } from "./locale";
import { SITE_URL } from "./seo";

// Privacy notice (GDPR Art. 13) for the website and for contacting the
// clinic through it. Written from what the site actually does - no cookies,
// no analytics, no forms or embeds; hosting on Vercel, images from
// Cloudinary, contact by e-mail/phone - so it has to be revisited whenever
// one of those changes (e.g. adding analytics or a contact form).
//
// The Hungarian text is authoritative; the others are translations with
// the same structure and the same legal references.

export type FactRow = { label: string; value: string };

export type ProcessingActivity = {
  title: string;
  rows: FactRow[];
};

export type PrivacyBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "facts"; rows: FactRow[] }
  | { kind: "processing"; items: ProcessingActivity[] };

export type PrivacySection = { id: string; title: string; blocks: PrivacyBlock[] };

export type PrivacyPolicy = {
  title: string;
  intro: string;
  effectiveLabel: string;
  tocTitle: string;
  hungarianPrevails?: string;
  sections: PrivacySection[];
};

const NAIH = {
  name: "Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)",
  address: "1055 Budapest, Falk Miksa utca 9–11.",
  postal: "1363 Budapest, Pf. 9.",
  phone: "+36 1 391 1400",
  email: "ugyfelszolgalat@naih.hu",
  web: "https://naih.hu",
};

const VERCEL = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA (https://vercel.com)";
const CLOUDINARY = "Cloudinary Ltd. (https://cloudinary.com)";

type CompanyLabels = {
  name: string;
  seat: string;
  address: string;
  registration: string;
  tax: string;
  representative: string;
  licence: string;
  email: string;
  phone: string;
  website: string;
  dpo: string;
};

// Company/contact rows, leaving out the fields not filled in yet.
function companyFacts(labels: CompanyLabels): FactRow[] {
  const rows: Array<[string, string | null]> = [
    [labels.name, COMPANY.legalName],
    [labels.seat, COMPANY.registeredSeat],
    [labels.address, CLINIC_ADDRESS_LINE],
    [labels.registration, COMPANY.companyRegistrationNumber],
    [labels.tax, COMPANY.taxNumber],
    [labels.representative, COMPANY.representative],
    [labels.licence, COMPANY.operatingLicence],
    [labels.email, CLINIC.email],
    [labels.phone, CLINIC.phoneDisplay],
    [labels.website, SITE_URL],
    [labels.dpo, COMPANY.dataProtectionOfficer],
  ];
  return rows.filter((row): row is [string, string] => row[1] !== null).map(([label, value]) => ({ label, value }));
}

function hu(): PrivacyPolicy {
  const row = (purpose: string, data: string, basis: string, retention: string, recipients?: string): FactRow[] => [
    { label: "Cél", value: purpose },
    { label: "Kezelt adatok", value: data },
    { label: "Jogalap", value: basis },
    { label: "Időtartam", value: retention },
    ...(recipients ? [{ label: "Címzett / adatfeldolgozó", value: recipients }] : []),
  ];

  return {
    title: "Adatkezelési tájékoztató",
    intro: `Az ${COMPANY.legalName} (a továbbiakban: Adatkezelő) elkötelezett a személyes adatok védelme mellett. Ez a tájékoztató az Európai Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet, a továbbiakban: GDPR) 13. cikke alapján bemutatja, hogyan kezeljük az Ön adatait a ${SITE_URL} weboldal használata, valamint a weboldalon megadott elérhetőségeken keresztül történő kapcsolatfelvétel során.`,
    effectiveLabel: "Hatályos",
    tocTitle: "Tartalom",
    sections: [
      {
        id: "adatkezelo",
        title: "1. Az adatkezelő és a szolgáltató adatai",
        blocks: [
          {
            kind: "facts",
            rows: companyFacts({
              name: "Cégnév",
              seat: "Székhely",
              address: "Rendelő, levelezési cím",
              registration: "Cégjegyzékszám",
              tax: "Adószám",
              representative: "Ügyvezető",
              licence: "Működési engedély",
              email: "E-mail",
              phone: "Telefon",
              website: "Weboldal",
              dpo: "Adatvédelmi tisztviselő",
            }),
          },
          {
            kind: "p",
            text: `Adatvédelmi kérdéseivel és kérelmeivel a ${CLINIC.email} e-mail címen vagy a fenti postacímen fordulhat hozzánk.`,
          },
        ],
      },
      {
        id: "jogszabalyok",
        title: "2. Az adatkezelés jogszabályi háttere",
        blocks: [
          {
            kind: "list",
            items: [
              "az Európai Parlament és a Tanács (EU) 2016/679 rendelete (GDPR);",
              "az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (Infotv.);",
              "az egészségügyi és a hozzájuk kapcsolódó személyes adatok kezeléséről és védelméről szóló 1997. évi XLVII. törvény (Eüak.);",
              "az elektronikus kereskedelmi szolgáltatások, valamint az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény (Ekertv.);",
              "az elektronikus hírközlésről szóló 2003. évi C. törvény (Eht.).",
            ],
          },
        ],
      },
      {
        id: "adatkezelesek",
        title: "3. Milyen adatokat, milyen célból és meddig kezelünk?",
        blocks: [
          {
            kind: "processing",
            items: [
              {
                title: "3.1. A weboldal megtekintése (technikai naplóadatok)",
                rows: row(
                  "A weboldal biztonságos működtetése, a hibák feltárása és a visszaélések megelőzése.",
                  "IP-cím, a látogatás időpontja, a megtekintett oldal címe, a böngésző és az operációs rendszer típusa, a hivatkozó oldal címe.",
                  "GDPR 6. cikk (1) bekezdés f) pont (jogos érdek: a weboldal biztonságos és zavartalan működtetése); Ekertv. 13/A. § (3) bekezdés.",
                  "A tárhelyszolgáltató naplóiban rövid ideig, legfeljebb 30 napig.",
                  `tárhelyszolgáltató: ${VERCEL}`
                ),
              },
              {
                title: "3.2. Képek megjelenítése",
                rows: row(
                  "A weboldalon látható fényképek gyors, a készülékhez igazított méretű kiszolgálása.",
                  "A kép letöltésekor a böngésző által automatikusan elküldött IP-cím és böngészőadatok. A képeket sütik küldése nélkül töltjük be.",
                  "GDPR 6. cikk (1) bekezdés f) pont (jogos érdek: a weboldal tartalmának hatékony megjelenítése).",
                  "Az adatfeldolgozó rendszereiben rövid ideig, a kiszolgáláshoz szükséges mértékben.",
                  `képkiszolgáló szolgáltató: ${CLOUDINARY}`
                ),
              },
              {
                title: "3.3. Kapcsolatfelvétel e-mailben vagy telefonon",
                rows: row(
                  "Kérdései megválaszolása, időpont egyeztetése.",
                  "Név, e-mail cím, telefonszám, az üzenet tartalma és az egyeztetett időpont.",
                  "Időpontkérés esetén GDPR 6. cikk (1) bekezdés b) pont (az Ön kérésére a szerződés megkötését megelőző lépések megtétele); egyéb kérdések esetén GDPR 6. cikk (1) bekezdés f) pont (jogos érdek: a megkeresések megválaszolása).",
                  "A megkeresés lezárását követő legfeljebb 1 évig. Ha a kapcsolatfelvételből kezelés lesz, az adatok az egészségügyi dokumentáció részévé válnak, és az Eüak. szabályai szerint őrizzük meg őket."
                ),
              },
              {
                title: "3.4. Kezelési terv és árajánlat kérése egészségügyi dokumentumok küldésével",
                rows: row(
                  "Kezelési terv és árajánlat készítése az Ön által megküldött dokumentumok (például panorámaröntgen-felvétel, korábbi kezelési terv) alapján.",
                  "A 3.3. pontban felsorolt adatok, valamint az Ön által megküldött egészségügyi adatok (a GDPR 9. cikke szerinti különleges adatok).",
                  "GDPR 6. cikk (1) bekezdés b) pont, valamint GDPR 9. cikk (2) bekezdés h) pont (egészségügyi ellátás nyújtása), összhangban az Eüak. 4. § (1) bekezdésével.",
                  "Ha a kezelésre sor kerül, az Eüak. 30. §-a szerint: az egészségügyi dokumentációt legalább 30 évig, a képalkotó diagnosztikai felvételt 10 évig őrizzük meg. Ha a kezelésre nem kerül sor, az adatokat az árajánlat megküldését követő legfeljebb 1 év elteltével töröljük."
                ),
              },
            ],
          },
          {
            kind: "p",
            text: "Kérjük, egészségügyi dokumentumot csak a kezelési terv elkészítéséhez szükséges mértékben küldjön, és ne küldje el más személy adatait. Felhívjuk figyelmét, hogy a hagyományos e-mail nem végponttól végpontig titkosított csatorna; ha ezt kockázatosnak tartja, a dokumentumokat személyesen is elhozhatja a rendelőbe.",
          },
          {
            kind: "p",
            text: "Közösségi oldalaink (Instagram, Facebook) és a térkép (Google Térkép) csak hivatkozásként szerepelnek a weboldalon: ezek nincsenek beágyazva, így a weboldal megnyitásakor nem jutnak el hozzájuk az Ön adatai. Ha a hivatkozásra kattint, vagy ott üzenetet küld nekünk, az adott szolgáltató saját adatkezelési tájékoztatója is irányadó. Az üzenetek megválaszolására a 3.3. pont szabályai vonatkoznak.",
          },
        ],
      },
      {
        id: "sutik",
        title: "4. Sütik (cookie-k)",
        blocks: [
          {
            kind: "p",
            text: "A weboldal nem használ sütiket, és nem tárol adatot az Ön eszközén. Nem használunk látogatottságmérő, remarketing vagy más követő eszközt, ezért az Eht. 155. § (4) bekezdése szerinti hozzájárulás kérésére nincs szükség. A választott nyelvet a weboldal címe (például /hu, /de) határozza meg.",
          },
        ],
      },
      {
        id: "adatfeldolgozok",
        title: "5. Adatfeldolgozók és címzettek",
        blocks: [
          {
            kind: "p",
            text: "Az adatokat elsősorban az Adatkezelő erre jogosult munkatársai ismerhetik meg, a szakmai titoktartási kötelezettség betartásával. A weboldal működtetéséhez az alábbi adatfeldolgozókat vesszük igénybe (GDPR 28. cikk):",
          },
          {
            kind: "list",
            items: [`Tárhelyszolgáltatás: ${VERCEL}`, `Képtárolás és -kiszolgálás: ${CLOUDINARY}`],
          },
          {
            kind: "p",
            text: "Személyes adatot nem adunk el, és harmadik félnek nem adunk át, kivéve, ha erre jogszabály kötelez (például hatósági vagy bírósági megkeresés esetén).",
          },
        ],
      },
      {
        id: "tovabbitas",
        title: "6. Adattovábbítás az Európai Gazdasági Térségen kívülre",
        blocks: [
          {
            kind: "p",
            text: "Adatfeldolgozóink az adatokat az Európai Gazdasági Térségen kívül (az Amerikai Egyesült Államokban, illetve Izraelben) is kezelhetik. Az adattovábbítás az Európai Bizottság megfelelőségi határozata alapján (GDPR 45. cikk) történik – az Egyesült Államok esetében az EU–USA adatvédelmi keretrendszer (a Bizottság (EU) 2023/1795 végrehajtási határozata), Izrael esetében a 2011/61/EU határozat alapján –, ennek hiányában a Bizottság által elfogadott általános adatvédelmi kikötések (GDPR 46. cikk (2) bekezdés c) pont) alkalmazásával.",
          },
        ],
      },
      {
        id: "biztonsag",
        title: "7. Adatbiztonság",
        blocks: [
          {
            kind: "p",
            text: "A GDPR 32. cikkének megfelelően megfelelő technikai és szervezési intézkedésekkel védjük az adatokat: a weboldal kizárólag titkosított (HTTPS) kapcsolaton érhető el, az adatokhoz csak az arra jogosult munkatársak férhetnek hozzá, és rendszereinket rendszeresen frissítjük.",
          },
          {
            kind: "p",
            text: "Adatvédelmi incidens esetén a GDPR 33. cikke szerint 72 órán belül bejelentést teszünk a NAIH-nál. Ha az incidens valószínűsíthetően magas kockázattal jár az Ön jogaira, a GDPR 34. cikke szerint Önt is késedelem nélkül tájékoztatjuk.",
          },
        ],
      },
      {
        id: "jogok",
        title: "8. Az Ön jogai",
        blocks: [
          {
            kind: "list",
            items: [
              "Hozzáférés (GDPR 15. cikk): tájékoztatást kérhet arról, hogy kezeljük-e és milyen adatait kezeljük, és másolatot kérhet róluk.",
              "Helyesbítés (GDPR 16. cikk): kérheti a pontatlan adatok javítását, a hiányosak kiegészítését.",
              "Törlés (GDPR 17. cikk): kérheti adatai törlését. Az egészségügyi dokumentáció kötelező megőrzési ideje alatt ennek a GDPR 17. cikk (3) bekezdése alapján nem tudunk eleget tenni.",
              "Az adatkezelés korlátozása (GDPR 18. cikk): bizonyos esetekben kérheti, hogy adatait csak tároljuk, de ne használjuk fel.",
              "Adathordozhatóság (GDPR 20. cikk): a szerződés alapján, automatizáltan kezelt adatait tagolt, géppel olvasható formában megkaphatja.",
              "Tiltakozás (GDPR 21. cikk): a jogos érdeken alapuló adatkezelés ellen bármikor tiltakozhat.",
              "Automatizált döntéshozatal (GDPR 22. cikk): adatai alapján nem hozunk kizárólag automatizált döntést, és profilalkotást sem végzünk.",
            ],
          },
          {
            kind: "p",
            text: `Kérelmét a ${CLINIC.email} címre vagy postán küldheti el. Kérelmére indokolatlan késedelem nélkül, legfeljebb egy hónapon belül válaszolunk; ez a határidő szükség esetén további két hónappal meghosszabbítható, amiről tájékoztatjuk (GDPR 12. cikk (3) bekezdés). A tájékoztatás és az intézkedés díjmentes (GDPR 12. cikk (5) bekezdés). Személyazonosságát a válasz előtt ellenőrizhetjük (GDPR 12. cikk (6) bekezdés).`,
          },
        ],
      },
      {
        id: "jogorvoslat",
        title: "9. Jogorvoslat",
        blocks: [
          {
            kind: "p",
            text: "Ha úgy érzi, hogy adatai kezelése sérti a jogait, kérjük, először keressen meg minket, hogy a problémát közösen orvosolhassuk. Ezen felül panaszt tehet a felügyeleti hatóságnál (GDPR 77. cikk, Infotv. 52. §):",
          },
          {
            kind: "facts",
            rows: [
              { label: "Hatóság", value: NAIH.name },
              { label: "Cím", value: NAIH.address },
              { label: "Postacím", value: NAIH.postal },
              { label: "Telefon", value: NAIH.phone },
              { label: "E-mail", value: NAIH.email },
              { label: "Honlap", value: NAIH.web },
            ],
          },
          {
            kind: "p",
            text: "Jogai megsértése esetén bírósághoz is fordulhat (GDPR 79. cikk, Infotv. 22–23. §). A per elbírálása a törvényszék hatáskörébe tartozik, és az – választása szerint – a lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindítható.",
          },
        ],
      },
      {
        id: "modositas",
        title: "10. A tájékoztató módosítása",
        blocks: [
          {
            kind: "p",
            text: "Ezt a tájékoztatót az adatkezelés vagy a jogszabályok változása esetén frissítjük. A mindenkor hatályos változat ezen az oldalon érhető el; a hatálybalépés dátumát az oldal tetején tüntetjük fel.",
          },
        ],
      },
    ],
  };
}

function en(): PrivacyPolicy {
  const row = (purpose: string, data: string, basis: string, retention: string, recipients?: string): FactRow[] => [
    { label: "Purpose", value: purpose },
    { label: "Data processed", value: data },
    { label: "Legal basis", value: basis },
    { label: "Retention", value: retention },
    ...(recipients ? [{ label: "Recipient / processor", value: recipients }] : []),
  ];

  return {
    title: "Privacy Policy",
    intro: `${COMPANY.legalName} (the "Controller") is committed to protecting your personal data. Under Article 13 of Regulation (EU) 2016/679 (General Data Protection Regulation, "GDPR"), this notice explains how we process your data when you use the ${SITE_URL} website and when you contact us through the details given on it.`,
    effectiveLabel: "Effective from",
    tocTitle: "Contents",
    hungarianPrevails: "This is a translation; in case of any discrepancy, the Hungarian version prevails.",
    sections: [
      {
        id: "adatkezelo",
        title: "1. Controller and service provider",
        blocks: [
          {
            kind: "facts",
            rows: companyFacts({
              name: "Company name",
              seat: "Registered seat",
              address: "Clinic and postal address",
              registration: "Company registration number",
              tax: "Tax number",
              representative: "Managing director",
              licence: "Operating licence",
              email: "E-mail",
              phone: "Phone",
              website: "Website",
              dpo: "Data protection officer",
            }),
          },
          {
            kind: "p",
            text: `You can send any data protection questions or requests to ${CLINIC.email} or to the postal address above.`,
          },
        ],
      },
      {
        id: "jogszabalyok",
        title: "2. Legal framework",
        blocks: [
          {
            kind: "list",
            items: [
              "Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR);",
              "Hungarian Act CXII of 2011 on informational self-determination and freedom of information (Infotv.);",
              "Hungarian Act XLVII of 1997 on the processing and protection of health and related personal data (Eüak.);",
              "Hungarian Act CVIII of 2001 on electronic commerce and information society services (Ekertv.);",
              "Hungarian Act C of 2003 on electronic communications (Eht.).",
            ],
          },
        ],
      },
      {
        id: "adatkezelesek",
        title: "3. What data we process, why, and for how long",
        blocks: [
          {
            kind: "processing",
            items: [
              {
                title: "3.1. Visiting the website (technical log data)",
                rows: row(
                  "Running the website securely, finding errors and preventing abuse.",
                  "IP address, time of visit, address of the page viewed, browser and operating system type, referring page.",
                  "GDPR Art. 6(1)(f) (legitimate interest: secure and uninterrupted operation of the website); Ekertv. Section 13/A(3).",
                  "Briefly in the hosting provider's logs, for no more than 30 days.",
                  `hosting provider: ${VERCEL}`
                ),
              },
              {
                title: "3.2. Displaying images",
                rows: row(
                  "Serving the photos on the website quickly and in a size suited to your device.",
                  "The IP address and browser data your browser sends automatically when downloading an image. Images are loaded without sending cookies.",
                  "GDPR Art. 6(1)(f) (legitimate interest: efficient display of the website's content).",
                  "Briefly in the processor's systems, as far as needed to serve the images.",
                  `image delivery provider: ${CLOUDINARY}`
                ),
              },
              {
                title: "3.3. Contacting us by e-mail or phone",
                rows: row(
                  "Answering your questions and arranging appointments.",
                  "Name, e-mail address, phone number, the content of your message and the agreed appointment.",
                  "For appointment requests, GDPR Art. 6(1)(b) (steps taken at your request prior to entering into a contract); for other questions, GDPR Art. 6(1)(f) (legitimate interest: answering enquiries).",
                  "Up to 1 year after your enquiry is closed. If the contact leads to treatment, the data become part of your medical records and are kept under the rules of the Eüak."
                ),
              },
              {
                title: "3.4. Requesting a treatment plan and quote by sending medical documents",
                rows: row(
                  "Preparing a treatment plan and quote based on the documents you send (e.g. a panoramic X-ray or an earlier treatment plan).",
                  "The data listed in 3.3, plus the health data you send (special categories of data under GDPR Art. 9).",
                  "GDPR Art. 6(1)(b) and GDPR Art. 9(2)(h) (provision of health care), in line with Eüak. Section 4(1).",
                  "If treatment takes place, under Eüak. Section 30: medical records are kept for at least 30 years, diagnostic imaging for 10 years. If no treatment takes place, the data are deleted no later than 1 year after the quote is sent."
                ),
              },
            ],
          },
          {
            kind: "p",
            text: "Please send medical documents only to the extent needed for the treatment plan, and do not send other people's data. Please note that ordinary e-mail is not end-to-end encrypted; if you consider this a risk, you can bring the documents to the clinic in person.",
          },
          {
            kind: "p",
            text: "Our social media pages (Instagram, Facebook) and the map (Google Maps) are only linked from the website, not embedded, so none of your data reaches them when you open the website. If you follow a link or message us there, that provider's own privacy policy also applies. Replies to such messages are handled as described in 3.3.",
          },
        ],
      },
      {
        id: "sutik",
        title: "4. Cookies",
        blocks: [
          {
            kind: "p",
            text: "This website uses no cookies and stores no data on your device. We use no analytics, remarketing or other tracking tools, so no consent under Section 155(4) of the Eht. is required. The language is set by the website address (e.g. /en, /de).",
          },
        ],
      },
      {
        id: "adatfeldolgozok",
        title: "5. Processors and recipients",
        blocks: [
          {
            kind: "p",
            text: "Your data are primarily accessible to the Controller's authorised staff, who are bound by professional confidentiality. We use the following processors to run the website (GDPR Art. 28):",
          },
          {
            kind: "list",
            items: [`Hosting: ${VERCEL}`, `Image storage and delivery: ${CLOUDINARY}`],
          },
          {
            kind: "p",
            text: "We do not sell personal data or pass it on to third parties, except where required by law (e.g. at the request of an authority or court).",
          },
        ],
      },
      {
        id: "tovabbitas",
        title: "6. Transfers outside the European Economic Area",
        blocks: [
          {
            kind: "p",
            text: "Our processors may also process data outside the European Economic Area (in the United States or Israel). Such transfers are based on an adequacy decision of the European Commission (GDPR Art. 45) - for the United States the EU-US Data Privacy Framework (Commission Implementing Decision (EU) 2023/1795), for Israel Decision 2011/61/EU - or, failing that, on the standard data protection clauses adopted by the Commission (GDPR Art. 46(2)(c)).",
          },
        ],
      },
      {
        id: "biztonsag",
        title: "7. Data security",
        blocks: [
          {
            kind: "p",
            text: "In line with GDPR Art. 32, we protect your data with appropriate technical and organisational measures: the website is only available over an encrypted (HTTPS) connection, only authorised staff can access the data, and our systems are kept up to date.",
          },
          {
            kind: "p",
            text: "In the event of a personal data breach, we notify the NAIH within 72 hours under GDPR Art. 33. If the breach is likely to result in a high risk to your rights, we also inform you without undue delay under GDPR Art. 34.",
          },
        ],
      },
      {
        id: "jogok",
        title: "8. Your rights",
        blocks: [
          {
            kind: "list",
            items: [
              "Access (GDPR Art. 15): you may ask whether and what data we process about you, and request a copy.",
              "Rectification (GDPR Art. 16): you may ask us to correct inaccurate data or complete incomplete data.",
              "Erasure (GDPR Art. 17): you may ask us to delete your data. During the mandatory retention period of medical records we cannot do so, under GDPR Art. 17(3).",
              "Restriction of processing (GDPR Art. 18): in certain cases you may ask us to store your data but not use them.",
              "Data portability (GDPR Art. 20): you may receive data processed by automated means on the basis of a contract in a structured, machine-readable format.",
              "Objection (GDPR Art. 21): you may object at any time to processing based on legitimate interest.",
              "Automated decision-making (GDPR Art. 22): we make no decisions based solely on automated processing and do not profile you.",
            ],
          },
          {
            kind: "p",
            text: `You can send your request to ${CLINIC.email} or by post. We respond without undue delay and within one month at the latest; this can be extended by two further months where necessary, in which case we inform you (GDPR Art. 12(3)). Information and action are free of charge (GDPR Art. 12(5)). We may verify your identity before responding (GDPR Art. 12(6)).`,
          },
        ],
      },
      {
        id: "jogorvoslat",
        title: "9. Remedies",
        blocks: [
          {
            kind: "p",
            text: "If you feel that the processing of your data infringes your rights, please contact us first so that we can resolve the issue together. You may also lodge a complaint with the supervisory authority (GDPR Art. 77, Infotv. Section 52):",
          },
          {
            kind: "facts",
            rows: [
              { label: "Authority", value: NAIH.name },
              { label: "Address", value: NAIH.address },
              { label: "Postal address", value: NAIH.postal },
              { label: "Phone", value: NAIH.phone },
              { label: "E-mail", value: NAIH.email },
              { label: "Website", value: NAIH.web },
            ],
          },
          {
            kind: "p",
            text: "You may also go to court if your rights are infringed (GDPR Art. 79, Infotv. Sections 22-23). Such cases are heard by the regional court (törvényszék), and you may choose to bring the action before the court of your place of residence or stay.",
          },
        ],
      },
      {
        id: "modositas",
        title: "10. Changes to this notice",
        blocks: [
          {
            kind: "p",
            text: "We update this notice whenever our processing or the law changes. The current version is always available on this page; its effective date is shown at the top.",
          },
        ],
      },
    ],
  };
}

function de(): PrivacyPolicy {
  const row = (purpose: string, data: string, basis: string, retention: string, recipients?: string): FactRow[] => [
    { label: "Zweck", value: purpose },
    { label: "Verarbeitete Daten", value: data },
    { label: "Rechtsgrundlage", value: basis },
    { label: "Speicherdauer", value: retention },
    ...(recipients ? [{ label: "Empfänger / Auftragsverarbeiter", value: recipients }] : []),
  ];

  return {
    title: "Datenschutzerklärung",
    intro: `Die ${COMPANY.legalName} (im Folgenden: Verantwortlicher) legt großen Wert auf den Schutz Ihrer personenbezogenen Daten. Gemäß Artikel 13 der Verordnung (EU) 2016/679 (Datenschutz-Grundverordnung, im Folgenden: DSGVO) informiert diese Erklärung darüber, wie wir Ihre Daten bei der Nutzung der Website ${SITE_URL} sowie bei einer Kontaktaufnahme über die dort angegebenen Kontaktdaten verarbeiten.`,
    effectiveLabel: "Gültig ab",
    tocTitle: "Inhalt",
    hungarianPrevails: "Dies ist eine Übersetzung; im Zweifelsfall ist die ungarische Fassung maßgeblich.",
    sections: [
      {
        id: "adatkezelo",
        title: "1. Verantwortlicher und Diensteanbieter",
        blocks: [
          {
            kind: "facts",
            rows: companyFacts({
              name: "Firma",
              seat: "Sitz",
              address: "Praxis- und Postanschrift",
              registration: "Firmenbuchnummer",
              tax: "Steuernummer",
              representative: "Geschäftsführer",
              licence: "Betriebsgenehmigung",
              email: "E-Mail",
              phone: "Telefon",
              website: "Website",
              dpo: "Datenschutzbeauftragter",
            }),
          },
          {
            kind: "p",
            text: `Fragen und Anliegen zum Datenschutz richten Sie bitte an ${CLINIC.email} oder an die obige Postanschrift.`,
          },
        ],
      },
      {
        id: "jogszabalyok",
        title: "2. Rechtsgrundlagen",
        blocks: [
          {
            kind: "list",
            items: [
              "Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (DSGVO);",
              "ungarisches Gesetz Nr. CXII von 2011 über das informationelle Selbstbestimmungsrecht und die Informationsfreiheit (Infotv.);",
              "ungarisches Gesetz Nr. XLVII von 1997 über die Verarbeitung und den Schutz von Gesundheitsdaten und damit verbundenen personenbezogenen Daten (Eüak.);",
              "ungarisches Gesetz Nr. CVIII von 2001 über den elektronischen Geschäftsverkehr und Dienste der Informationsgesellschaft (Ekertv.);",
              "ungarisches Gesetz Nr. C von 2003 über die elektronische Kommunikation (Eht.).",
            ],
          },
        ],
      },
      {
        id: "adatkezelesek",
        title: "3. Welche Daten wir zu welchem Zweck und wie lange verarbeiten",
        blocks: [
          {
            kind: "processing",
            items: [
              {
                title: "3.1. Besuch der Website (technische Protokolldaten)",
                rows: row(
                  "Sicherer Betrieb der Website, Fehleranalyse und Missbrauchsverhinderung.",
                  "IP-Adresse, Zeitpunkt des Besuchs, Adresse der aufgerufenen Seite, Browser- und Betriebssystemtyp, verweisende Seite.",
                  "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: sicherer und störungsfreier Betrieb der Website); § 13/A Abs. 3 Ekertv.",
                  "Kurzzeitig in den Protokollen des Hosting-Anbieters, höchstens 30 Tage.",
                  `Hosting-Anbieter: ${VERCEL}`
                ),
              },
              {
                title: "3.2. Anzeige von Bildern",
                rows: row(
                  "Schnelle, an Ihr Gerät angepasste Auslieferung der Fotos auf der Website.",
                  "Die IP-Adresse und Browserdaten, die Ihr Browser beim Laden eines Bildes automatisch übermittelt. Bilder werden ohne Übermittlung von Cookies geladen.",
                  "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: effiziente Darstellung der Website-Inhalte).",
                  "Kurzzeitig in den Systemen des Auftragsverarbeiters, soweit für die Auslieferung erforderlich.",
                  `Anbieter für die Bildauslieferung: ${CLOUDINARY}`
                ),
              },
              {
                title: "3.3. Kontaktaufnahme per E-Mail oder Telefon",
                rows: row(
                  "Beantwortung Ihrer Fragen und Terminvereinbarung.",
                  "Name, E-Mail-Adresse, Telefonnummer, Inhalt Ihrer Nachricht und der vereinbarte Termin.",
                  "Bei Terminanfragen Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage); bei sonstigen Fragen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Beantwortung von Anfragen).",
                  "Bis zu 1 Jahr nach Abschluss Ihrer Anfrage. Kommt es zu einer Behandlung, werden die Daten Teil Ihrer Patientendokumentation und nach den Regeln des Eüak. aufbewahrt."
                ),
              },
              {
                title: "3.4. Anfrage eines Behandlungsplans und Kostenvoranschlags mit medizinischen Unterlagen",
                rows: row(
                  "Erstellung eines Behandlungsplans und Kostenvoranschlags anhand der von Ihnen übermittelten Unterlagen (z. B. Panorama-Röntgenaufnahme, früherer Behandlungsplan).",
                  "Die unter 3.3 genannten Daten sowie die von Ihnen übermittelten Gesundheitsdaten (besondere Kategorien personenbezogener Daten gemäß Art. 9 DSGVO).",
                  "Art. 6 Abs. 1 lit. b und Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung), im Einklang mit § 4 Abs. 1 Eüak.",
                  "Bei erfolgter Behandlung gemäß § 30 Eüak.: Patientendokumentation mindestens 30 Jahre, bildgebende Diagnostik 10 Jahre. Kommt es zu keiner Behandlung, werden die Daten spätestens 1 Jahr nach Übermittlung des Kostenvoranschlags gelöscht."
                ),
              },
            ],
          },
          {
            kind: "p",
            text: "Bitte senden Sie medizinische Unterlagen nur in dem für den Behandlungsplan erforderlichen Umfang und keine Daten anderer Personen. Bitte beachten Sie, dass herkömmliche E-Mails nicht Ende-zu-Ende-verschlüsselt sind; wenn Ihnen das zu riskant ist, können Sie die Unterlagen auch persönlich in die Praxis bringen.",
          },
          {
            kind: "p",
            text: "Unsere Social-Media-Seiten (Instagram, Facebook) und die Karte (Google Maps) sind auf der Website nur verlinkt, nicht eingebettet; beim Aufruf der Website gelangen daher keine Ihrer Daten zu diesen Anbietern. Wenn Sie einem Link folgen oder uns dort eine Nachricht senden, gilt auch die Datenschutzerklärung des jeweiligen Anbieters. Für die Beantwortung solcher Nachrichten gilt Punkt 3.3.",
          },
        ],
      },
      {
        id: "sutik",
        title: "4. Cookies",
        blocks: [
          {
            kind: "p",
            text: "Diese Website verwendet keine Cookies und speichert keine Daten auf Ihrem Gerät. Wir setzen keine Analyse-, Remarketing- oder sonstigen Tracking-Werkzeuge ein, daher ist keine Einwilligung nach § 155 Abs. 4 Eht. erforderlich. Die Sprache wird über die Website-Adresse festgelegt (z. B. /de, /en).",
          },
        ],
      },
      {
        id: "adatfeldolgozok",
        title: "5. Auftragsverarbeiter und Empfänger",
        blocks: [
          {
            kind: "p",
            text: "Zugriff auf Ihre Daten haben in erster Linie die befugten Mitarbeiter des Verantwortlichen, die der beruflichen Schweigepflicht unterliegen. Für den Betrieb der Website setzen wir folgende Auftragsverarbeiter ein (Art. 28 DSGVO):",
          },
          {
            kind: "list",
            items: [`Hosting: ${VERCEL}`, `Bildspeicherung und -auslieferung: ${CLOUDINARY}`],
          },
          {
            kind: "p",
            text: "Wir verkaufen keine personenbezogenen Daten und geben sie nicht an Dritte weiter, es sei denn, wir sind gesetzlich dazu verpflichtet (z. B. auf Anfrage einer Behörde oder eines Gerichts).",
          },
        ],
      },
      {
        id: "tovabbitas",
        title: "6. Übermittlung in Länder außerhalb des Europäischen Wirtschaftsraums",
        blocks: [
          {
            kind: "p",
            text: "Unsere Auftragsverarbeiter können Daten auch außerhalb des Europäischen Wirtschaftsraums (in den Vereinigten Staaten bzw. in Israel) verarbeiten. Die Übermittlung erfolgt auf Grundlage eines Angemessenheitsbeschlusses der Europäischen Kommission (Art. 45 DSGVO) – für die Vereinigten Staaten des EU-US-Datenschutzrahmens (Durchführungsbeschluss (EU) 2023/1795), für Israel des Beschlusses 2011/61/EU – oder andernfalls auf Grundlage der von der Kommission erlassenen Standarddatenschutzklauseln (Art. 46 Abs. 2 lit. c DSGVO).",
          },
        ],
      },
      {
        id: "biztonsag",
        title: "7. Datensicherheit",
        blocks: [
          {
            kind: "p",
            text: "Gemäß Art. 32 DSGVO schützen wir Ihre Daten durch geeignete technische und organisatorische Maßnahmen: Die Website ist nur über eine verschlüsselte (HTTPS-)Verbindung erreichbar, nur befugte Mitarbeiter haben Zugriff auf die Daten, und unsere Systeme werden regelmäßig aktualisiert.",
          },
          {
            kind: "p",
            text: "Im Fall einer Datenschutzverletzung melden wir diese gemäß Art. 33 DSGVO binnen 72 Stunden der NAIH. Birgt die Verletzung voraussichtlich ein hohes Risiko für Ihre Rechte, benachrichtigen wir Sie gemäß Art. 34 DSGVO unverzüglich.",
          },
        ],
      },
      {
        id: "jogok",
        title: "8. Ihre Rechte",
        blocks: [
          {
            kind: "list",
            items: [
              "Auskunft (Art. 15 DSGVO): Sie können erfragen, ob und welche Daten wir über Sie verarbeiten, und eine Kopie verlangen.",
              "Berichtigung (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger und die Vervollständigung unvollständiger Daten verlangen.",
              "Löschung (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen. Während der gesetzlichen Aufbewahrungsfrist der Patientendokumentation ist dies gemäß Art. 17 Abs. 3 DSGVO nicht möglich.",
              "Einschränkung der Verarbeitung (Art. 18 DSGVO): In bestimmten Fällen können Sie verlangen, dass wir Ihre Daten nur speichern, aber nicht verwenden.",
              "Datenübertragbarkeit (Art. 20 DSGVO): Sie können auf Vertragsbasis automatisiert verarbeitete Daten in einem strukturierten, maschinenlesbaren Format erhalten.",
              "Widerspruch (Art. 21 DSGVO): Sie können der auf berechtigtem Interesse beruhenden Verarbeitung jederzeit widersprechen.",
              "Automatisierte Entscheidungen (Art. 22 DSGVO): Wir treffen keine ausschließlich automatisierten Entscheidungen und führen kein Profiling durch.",
            ],
          },
          {
            kind: "p",
            text: `Ihren Antrag können Sie an ${CLINIC.email} oder per Post senden. Wir antworten unverzüglich, spätestens innerhalb eines Monats; diese Frist kann bei Bedarf um weitere zwei Monate verlängert werden, worüber wir Sie informieren (Art. 12 Abs. 3 DSGVO). Auskunft und Maßnahmen sind unentgeltlich (Art. 12 Abs. 5 DSGVO). Vor der Beantwortung können wir Ihre Identität überprüfen (Art. 12 Abs. 6 DSGVO).`,
          },
        ],
      },
      {
        id: "jogorvoslat",
        title: "9. Rechtsbehelfe",
        blocks: [
          {
            kind: "p",
            text: "Wenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten Ihre Rechte verletzt, wenden Sie sich bitte zuerst an uns, damit wir das Problem gemeinsam lösen können. Darüber hinaus können Sie Beschwerde bei der Aufsichtsbehörde einlegen (Art. 77 DSGVO, § 52 Infotv.):",
          },
          {
            kind: "facts",
            rows: [
              { label: "Behörde", value: NAIH.name },
              { label: "Anschrift", value: NAIH.address },
              { label: "Postanschrift", value: NAIH.postal },
              { label: "Telefon", value: NAIH.phone },
              { label: "E-Mail", value: NAIH.email },
              { label: "Website", value: NAIH.web },
            ],
          },
          {
            kind: "p",
            text: "Bei einer Verletzung Ihrer Rechte können Sie auch den Rechtsweg beschreiten (Art. 79 DSGVO, §§ 22–23 Infotv.). Zuständig ist der Gerichtshof (törvényszék); die Klage kann nach Ihrer Wahl auch bei dem Gericht Ihres Wohn- oder Aufenthaltsortes erhoben werden.",
          },
        ],
      },
      {
        id: "modositas",
        title: "10. Änderungen dieser Erklärung",
        blocks: [
          {
            kind: "p",
            text: "Wir aktualisieren diese Erklärung bei Änderungen der Datenverarbeitung oder der Rechtslage. Die jeweils gültige Fassung finden Sie auf dieser Seite; das Datum des Inkrafttretens ist oben angegeben.",
          },
        ],
      },
    ],
  };
}

function it(): PrivacyPolicy {
  const row = (purpose: string, data: string, basis: string, retention: string, recipients?: string): FactRow[] => [
    { label: "Finalità", value: purpose },
    { label: "Dati trattati", value: data },
    { label: "Base giuridica", value: basis },
    { label: "Conservazione", value: retention },
    ...(recipients ? [{ label: "Destinatario / responsabile", value: recipients }] : []),
  ];

  return {
    title: "Informativa sulla privacy",
    intro: `${COMPANY.legalName} (di seguito: Titolare) si impegna a proteggere i Suoi dati personali. Ai sensi dell'articolo 13 del Regolamento (UE) 2016/679 (Regolamento generale sulla protezione dei dati, di seguito: GDPR), la presente informativa spiega come trattiamo i Suoi dati quando utilizza il sito ${SITE_URL} e quando ci contatta tramite i recapiti indicati sul sito.`,
    effectiveLabel: "In vigore dal",
    tocTitle: "Indice",
    hungarianPrevails: "Questa è una traduzione; in caso di discrepanze prevale la versione ungherese.",
    sections: [
      {
        id: "adatkezelo",
        title: "1. Titolare del trattamento e fornitore del servizio",
        blocks: [
          {
            kind: "facts",
            rows: companyFacts({
              name: "Ragione sociale",
              seat: "Sede legale",
              address: "Studio e indirizzo postale",
              registration: "Numero di registro delle imprese",
              tax: "Partita IVA / codice fiscale",
              representative: "Amministratore",
              licence: "Autorizzazione sanitaria",
              email: "E-mail",
              phone: "Telefono",
              website: "Sito web",
              dpo: "Responsabile della protezione dei dati",
            }),
          },
          {
            kind: "p",
            text: `Per domande o richieste sulla protezione dei dati può scriverci a ${CLINIC.email} o all'indirizzo postale indicato sopra.`,
          },
        ],
      },
      {
        id: "jogszabalyok",
        title: "2. Quadro normativo",
        blocks: [
          {
            kind: "list",
            items: [
              "Regolamento (UE) 2016/679 del Parlamento europeo e del Consiglio (GDPR);",
              "legge ungherese n. CXII del 2011 sull'autodeterminazione informativa e sulla libertà di informazione (Infotv.);",
              "legge ungherese n. XLVII del 1997 sul trattamento e sulla protezione dei dati sanitari e dei dati personali correlati (Eüak.);",
              "legge ungherese n. CVIII del 2001 sul commercio elettronico e sui servizi della società dell'informazione (Ekertv.);",
              "legge ungherese n. C del 2003 sulle comunicazioni elettroniche (Eht.).",
            ],
          },
        ],
      },
      {
        id: "adatkezelesek",
        title: "3. Quali dati trattiamo, per quale finalità e per quanto tempo",
        blocks: [
          {
            kind: "processing",
            items: [
              {
                title: "3.1. Visita del sito (dati tecnici di log)",
                rows: row(
                  "Funzionamento sicuro del sito, individuazione degli errori e prevenzione degli abusi.",
                  "Indirizzo IP, data e ora della visita, indirizzo della pagina visitata, tipo di browser e di sistema operativo, pagina di provenienza.",
                  "Art. 6, par. 1, lett. f) GDPR (legittimo interesse: funzionamento sicuro e continuo del sito); art. 13/A, comma 3, Ekertv.",
                  "Per breve tempo nei log del fornitore di hosting, al massimo 30 giorni.",
                  `fornitore di hosting: ${VERCEL}`
                ),
              },
              {
                title: "3.2. Visualizzazione delle immagini",
                rows: row(
                  "Distribuzione rapida delle foto del sito, in dimensioni adatte al Suo dispositivo.",
                  "L'indirizzo IP e i dati del browser che il Suo browser invia automaticamente quando scarica un'immagine. Le immagini vengono caricate senza inviare cookie.",
                  "Art. 6, par. 1, lett. f) GDPR (legittimo interesse: visualizzazione efficiente dei contenuti del sito).",
                  "Per breve tempo nei sistemi del responsabile, nella misura necessaria alla distribuzione.",
                  `fornitore per la distribuzione delle immagini: ${CLOUDINARY}`
                ),
              },
              {
                title: "3.3. Contatto via e-mail o telefono",
                rows: row(
                  "Rispondere alle Sue domande e fissare appuntamenti.",
                  "Nome, indirizzo e-mail, numero di telefono, contenuto del messaggio e appuntamento concordato.",
                  "Per le richieste di appuntamento, art. 6, par. 1, lett. b) GDPR (misure precontrattuali adottate su Sua richiesta); per altre domande, art. 6, par. 1, lett. f) GDPR (legittimo interesse: rispondere alle richieste).",
                  "Fino a 1 anno dalla chiusura della richiesta. Se il contatto porta a un trattamento, i dati entrano a far parte della Sua documentazione sanitaria e sono conservati secondo le norme dell'Eüak."
                ),
              },
              {
                title: "3.4. Richiesta di piano di cura e preventivo con invio di documenti sanitari",
                rows: row(
                  "Preparare un piano di cura e un preventivo sulla base dei documenti inviati (ad es. ortopantomografia, precedente piano di cura).",
                  "I dati indicati al punto 3.3 e i dati sanitari da Lei inviati (categorie particolari di dati ai sensi dell'art. 9 GDPR).",
                  "Art. 6, par. 1, lett. b) e art. 9, par. 2, lett. h) GDPR (assistenza sanitaria), in conformità all'art. 4, comma 1, Eüak.",
                  "In caso di trattamento, ai sensi dell'art. 30 Eüak.: documentazione sanitaria per almeno 30 anni, immagini diagnostiche per 10 anni. Se il trattamento non avviene, i dati sono cancellati entro 1 anno dall'invio del preventivo."
                ),
              },
            ],
          },
          {
            kind: "p",
            text: "La preghiamo di inviare documenti sanitari solo nella misura necessaria al piano di cura e di non inviare dati di altre persone. Tenga presente che la normale e-mail non è cifrata end-to-end; se lo ritiene un rischio, può portare i documenti di persona allo studio.",
          },
          {
            kind: "p",
            text: "Le nostre pagine social (Instagram, Facebook) e la mappa (Google Maps) sono solo collegate dal sito, non incorporate: aprendo il sito, nessun Suo dato viene trasmesso a tali servizi. Se segue un collegamento o ci invia un messaggio su di essi, si applica anche l'informativa del rispettivo fornitore. Per la risposta a tali messaggi vale il punto 3.3.",
          },
        ],
      },
      {
        id: "sutik",
        title: "4. Cookie",
        blocks: [
          {
            kind: "p",
            text: "Questo sito non utilizza cookie e non memorizza dati sul Suo dispositivo. Non utilizziamo strumenti di analisi, remarketing o altri strumenti di tracciamento, pertanto non è necessario il consenso ai sensi dell'art. 155, comma 4, Eht. La lingua è determinata dall'indirizzo del sito (ad es. /it, /en).",
          },
        ],
      },
      {
        id: "adatfeldolgozok",
        title: "5. Responsabili del trattamento e destinatari",
        blocks: [
          {
            kind: "p",
            text: "I Suoi dati sono accessibili principalmente al personale autorizzato del Titolare, vincolato al segreto professionale. Per il funzionamento del sito ci avvaliamo dei seguenti responsabili del trattamento (art. 28 GDPR):",
          },
          {
            kind: "list",
            items: [`Hosting: ${VERCEL}`, `Archiviazione e distribuzione delle immagini: ${CLOUDINARY}`],
          },
          {
            kind: "p",
            text: "Non vendiamo dati personali né li comunichiamo a terzi, salvo obbligo di legge (ad es. su richiesta di un'autorità o di un tribunale).",
          },
        ],
      },
      {
        id: "tovabbitas",
        title: "6. Trasferimenti al di fuori dello Spazio economico europeo",
        blocks: [
          {
            kind: "p",
            text: "I nostri responsabili possono trattare dati anche al di fuori dello Spazio economico europeo (negli Stati Uniti o in Israele). Il trasferimento avviene sulla base di una decisione di adeguatezza della Commissione europea (art. 45 GDPR) – per gli Stati Uniti il quadro UE-USA per la protezione dei dati (decisione di esecuzione (UE) 2023/1795), per Israele la decisione 2011/61/UE – oppure, in mancanza, delle clausole tipo di protezione dei dati adottate dalla Commissione (art. 46, par. 2, lett. c) GDPR).",
          },
        ],
      },
      {
        id: "biztonsag",
        title: "7. Sicurezza dei dati",
        blocks: [
          {
            kind: "p",
            text: "In conformità all'art. 32 GDPR proteggiamo i Suoi dati con misure tecniche e organizzative adeguate: il sito è accessibile solo tramite connessione cifrata (HTTPS), solo il personale autorizzato può accedere ai dati e i nostri sistemi sono aggiornati regolarmente.",
          },
          {
            kind: "p",
            text: "In caso di violazione dei dati personali, la notifichiamo alla NAIH entro 72 ore ai sensi dell'art. 33 GDPR. Se la violazione presenta probabilmente un rischio elevato per i Suoi diritti, La informiamo senza ingiustificato ritardo ai sensi dell'art. 34 GDPR.",
          },
        ],
      },
      {
        id: "jogok",
        title: "8. I Suoi diritti",
        blocks: [
          {
            kind: "list",
            items: [
              "Accesso (art. 15 GDPR): può chiedere se e quali dati trattiamo su di Lei e ottenerne una copia.",
              "Rettifica (art. 16 GDPR): può chiedere la correzione dei dati inesatti e l'integrazione di quelli incompleti.",
              "Cancellazione (art. 17 GDPR): può chiedere la cancellazione dei Suoi dati. Durante il periodo obbligatorio di conservazione della documentazione sanitaria ciò non è possibile ai sensi dell'art. 17, par. 3, GDPR.",
              "Limitazione del trattamento (art. 18 GDPR): in alcuni casi può chiedere che i Suoi dati siano solo conservati, ma non utilizzati.",
              "Portabilità (art. 20 GDPR): può ricevere in formato strutturato e leggibile da dispositivo automatico i dati trattati con mezzi automatizzati sulla base di un contratto.",
              "Opposizione (art. 21 GDPR): può opporsi in qualsiasi momento al trattamento basato sul legittimo interesse.",
              "Processi decisionali automatizzati (art. 22 GDPR): non adottiamo decisioni basate unicamente su trattamenti automatizzati né effettuiamo profilazione.",
            ],
          },
          {
            kind: "p",
            text: `Può inviare la Sua richiesta a ${CLINIC.email} o per posta. Rispondiamo senza ingiustificato ritardo e al più tardi entro un mese; il termine può essere prorogato di altri due mesi se necessario, informandoLa (art. 12, par. 3, GDPR). Le informazioni e le azioni sono gratuite (art. 12, par. 5, GDPR). Prima di rispondere possiamo verificare la Sua identità (art. 12, par. 6, GDPR).`,
          },
        ],
      },
      {
        id: "jogorvoslat",
        title: "9. Mezzi di ricorso",
        blocks: [
          {
            kind: "p",
            text: "Se ritiene che il trattamento dei Suoi dati violi i Suoi diritti, La invitiamo a contattarci prima di tutto, per risolvere insieme il problema. Può inoltre proporre reclamo all'autorità di controllo (art. 77 GDPR, art. 52 Infotv.):",
          },
          {
            kind: "facts",
            rows: [
              { label: "Autorità", value: NAIH.name },
              { label: "Indirizzo", value: NAIH.address },
              { label: "Indirizzo postale", value: NAIH.postal },
              { label: "Telefono", value: NAIH.phone },
              { label: "E-mail", value: NAIH.email },
              { label: "Sito web", value: NAIH.web },
            ],
          },
          {
            kind: "p",
            text: "In caso di violazione dei Suoi diritti può anche rivolgersi all'autorità giudiziaria (art. 79 GDPR, artt. 22–23 Infotv.). Competente è il tribunale regionale (törvényszék); a Sua scelta, l'azione può essere proposta anche dinanzi al tribunale del luogo di residenza o di dimora.",
          },
        ],
      },
      {
        id: "modositas",
        title: "10. Modifiche alla presente informativa",
        blocks: [
          {
            kind: "p",
            text: "Aggiorniamo la presente informativa in caso di modifiche al trattamento o alla normativa. La versione in vigore è sempre disponibile su questa pagina; la data di entrata in vigore è indicata in alto.",
          },
        ],
      },
    ],
  };
}

const POLICIES: Record<Locale, () => PrivacyPolicy> = { hu, en, de, it };

export function privacyPolicy(locale: Locale): PrivacyPolicy {
  return POLICIES[locale]();
}
