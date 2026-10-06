import { describe, it, expect } from "vitest";
import { CLINIC } from "../../lib/clinic-info";
import { clinicStructuredData, openingHoursSpecification, serializeJsonLd } from "../../lib/structured-data";
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
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
});
