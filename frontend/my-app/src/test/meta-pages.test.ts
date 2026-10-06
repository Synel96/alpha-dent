import { describe, it, expect } from "vitest";
import rootTitle from "../../pages/+title";
import rootDescription from "../../pages/+description";
import contactTitle from "../../pages/kapcsolat/+title";
import contactDescription from "../../pages/kapcsolat/+description";
import implantTitle from "../../pages/szolgaltatasaink/implantologia/+title";
import privacyTitle from "../../pages/adatkezelesi-tajekoztato/+title";
import { metaResources, type MetaPage } from "../../lib/i18n/meta";
import { LOCALES } from "../../lib/locale";

const PAGES = Object.keys(metaResources.hu.meta.pages) as MetaPage[];

describe("Per-oldal title/description", () => {
  it("a +title / +description fájlok a saját oldaluk lefordított szövegét adják", () => {
    expect(rootTitle({ locale: "hu" })).toBe("Alphadent Fogászati Klinika Sopron | Implantológia, Szájsebészet");
    expect(rootDescription({ locale: "de" })).toContain("Zahnklinik in Sopron");
    expect(implantTitle({ locale: "de" })).toBe("Zahnimplantate in Sopron, Ungarn | Alphadent");
    expect(contactTitle({ locale: "hu" })).toContain("Arany János u. 13.");
    expect(contactDescription({ locale: "en" })).toContain("+36 20 80 80 600");
    expect(privacyTitle({ locale: "de" })).toBe("Datenschutzerklärung | Alphadent");
  });

  it("minden nyelven minden oldalnak van címe és leírása, és a cím a márkát is tartalmazza", () => {
    for (const locale of LOCALES) {
      for (const page of PAGES) {
        const { title, description } = metaResources[locale].meta.pages[page];
        expect(title, `${locale}/${page}`).toContain("Alphadent");
        expect(description.length, `${locale}/${page}`).toBeGreaterThan(50);
      }
    }
  });

  it("a helyi kereséshez minden tartalmi oldal címe tartalmazza Sopront", () => {
    for (const locale of LOCALES) {
      for (const page of PAGES.filter((page) => page !== "privacy")) {
        expect(metaResources[locale].meta.pages[page].title, `${locale}/${page}`).toContain("Sopron");
      }
    }
  });

  it("a címek és leírások beférnek abba, amit a Google a találati listában megjelenít", () => {
    for (const locale of LOCALES) {
      for (const page of PAGES) {
        const { title, description } = metaResources[locale].meta.pages[page];
        expect(title.length, `${locale}/${page} title`).toBeLessThanOrEqual(70);
        expect(description.length, `${locale}/${page} description`).toBeLessThanOrEqual(165);
      }
    }
  });

  it("az oldalak címei egyediek (nincs két azonos című oldal)", () => {
    for (const locale of LOCALES) {
      const titles = PAGES.map((page) => metaResources[locale].meta.pages[page].title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
