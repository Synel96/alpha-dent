import { describe, it, expect } from "vitest";
import { CLINIC } from "../../lib/clinic-info";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  breadcrumbStructuredData,
  clinicStructuredData,
  openingHoursSpecification,
  pageStructuredData,
  serializeJsonLd,
} from "../../lib/structured-data";
import { LOCALES, PAGE_PATHNAMES } from "../../lib/locale";
import { ogImageUrl } from "../../lib/seo";

describe("schema.org strukturált adat", () => {
  const graph = clinicStructuredData("hu")["@graph"];
  const dentist = graph.find((node) => node["@type"] === "Dentist") as Record<string, unknown>;

  it("Dentist típusú, a soproni címmel, koordinátákkal és elérhetőségekkel", () => {
    expect(dentist).toBeDefined();
    expect(dentist.address).toMatchObject({
      streetAddress: "Arany János u. 13.",
      postalCode: "9400",
      addressLocality: "Sopron",
      addressCountry: "HU",
    });
    expect(dentist.geo).toMatchObject({ latitude: 47.6777786, longitude: 16.5896789 });
    expect(dentist.telephone).toBe(CLINIC.phoneE164);
    expect(dentist.url).toBe("https://alpha-dent.eu/hu");
    expect(dentist.sameAs).toEqual(CLINIC.socialProfiles);
  });

  it("a nyitvatartást ugyanabból az adatból számolja, mint a hero nyitva/zárva jelzése", () => {
    expect(openingHoursSpecification()).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "13:00",
      },
    ]);
  });

  it("jelzi a Google-nek az ingyenes parkolást, a nyelvnek megfelelő szöveggel", () => {
    expect(dentist.amenityFeature).toMatchObject({ "@type": "LocationFeatureSpecification", value: true });
    expect(String((dentist.amenityFeature as { name: string }).name)).toContain("parkolás");
  });

  it("a leírás és az URL nyelvfüggő", () => {
    const german = clinicStructuredData("de")["@graph"].find((node) => node["@type"] === "Dentist") as Record<
      string,
      unknown
    >;
    expect(german.url).toBe("https://alpha-dent.eu/de");
    expect(String(german.description)).toContain("Zahnklinik");
  });

  it("a JSON-LD-ben a < karakter escape-elve van, így nem zárhatja le idő előtt a script taget", () => {
    expect(serializeJsonLd({ text: "</script><b>" })).toBe('{"text":"\\u003c/script>\\u003cb>"}');
  });

  it("a megosztási kép 1200x630-as, JPG formátumú Cloudinary kép", () => {
    expect(ogImageUrl()).toContain("/upload/w_1200,h_630,c_fill,g_auto,q_78,f_jpg/");
  });

  it("megadja a logót (létező, legalább 112 px-es PNG) és a név keresett változatait", () => {
    expect(dentist.logo).toBe(`https://alpha-dent.eu${CLINIC.logoPath}`);
    expect(existsSync(resolve(__dirname, "../../public", CLINIC.logoPath.slice(1)))).toBe(true);
    expect(dentist.alternateName).toEqual(expect.arrayContaining(["Alpha Dent", "Alfadent"]));
  });
});

describe("morzsamenü (BreadcrumbList)", () => {
  it("a főoldalon nincs, minden más oldalon és nyelven van", () => {
    for (const locale of LOCALES) {
      expect(breadcrumbStructuredData(locale, "/")).toBeNull();
      for (const page of PAGE_PATHNAMES.filter((p) => p !== "/")) {
        expect(breadcrumbStructuredData(locale, page), `${locale} ${page}`).not.toBeNull();
      }
    }
  });

  it("egy szolgáltatásoldalon Kezdőlap > Szolgáltatások > szolgáltatás, a lefordított címekkel", () => {
    expect(breadcrumbStructuredData("de", "/szolgaltatasaink/implantologia")?.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://alpha-dent.eu/de" },
      { "@type": "ListItem", position: 2, name: "Dienstleistungen", item: "https://alpha-dent.eu/de/leistungen" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Implantologie",
        item: "https://alpha-dent.eu/de/leistungen/implantologie",
      },
    ]);
  });

  it("a fejlécbe kerülő adatban a rendelő mellett ott a morzsamenü", () => {
    const types = pageStructuredData("hu", "/kapcsolat")["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["Dentist", "WebSite", "BreadcrumbList"]);
  });
});
