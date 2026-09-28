import { describe, it, expect } from "vitest";
import { LOCALES, PAGE_PATHNAMES, extractLocale, localizeHref } from "../../lib/locale";

describe("localizeHref", () => {
  it("minden nyelvet prefixel, a magyart is", () => {
    expect(localizeHref("hu", "/kapcsolat")).toBe("/hu/kapcsolat");
    expect(localizeHref("en", "/kapcsolat")).toBe("/en/contact");
    expect(localizeHref("de", "/kapcsolat")).toBe("/de/kontakt");
    expect(localizeHref("it", "/kapcsolat")).toBe("/it/contatti");
  });

  it("a beágyazott szolgáltatás oldalakat is lefordítja", () => {
    expect(localizeHref("en", "/szolgaltatasaink/szajsebeszet")).toBe("/en/services/oral-surgery");
    expect(localizeHref("de", "/szolgaltatasaink/esztetikai-fogaszat")).toBe(
      "/de/leistungen/aesthetische-zahnheilkunde"
    );
  });

  it("a főoldalhoz nem told perjelet a prefix után", () => {
    expect(localizeHref("hu", "/")).toBe("/hu");
    expect(localizeHref("en", "/")).toBe("/en");
  });
});

describe("extractLocale", () => {
  it("a lefordított URL-t visszafordítja a magyar logikai útvonalra", () => {
    expect(extractLocale("/de/kontakt")).toEqual({ locale: "de", pathnameWithoutLocale: "/kapcsolat" });
    expect(extractLocale("/en/services/implantology")).toEqual({
      locale: "en",
      pathnameWithoutLocale: "/szolgaltatasaink/implantologia",
    });
  });

  it("a /hu prefixet is felismeri", () => {
    expect(extractLocale("/hu/kapcsolat")).toEqual({ locale: "hu", pathnameWithoutLocale: "/kapcsolat" });
    expect(extractLocale("/hu")).toEqual({ locale: "hu", pathnameWithoutLocale: "/" });
  });

  it("a záró perjelet figyelmen kívül hagyja", () => {
    expect(extractLocale("/en/contact/")).toEqual({ locale: "en", pathnameWithoutLocale: "/kapcsolat" });
  });

  it("prefix nélküli útvonalat magyarként kezel, változatlan útvonallal", () => {
    expect(extractLocale("/kapcsolat")).toEqual({ locale: "hu", pathnameWithoutLocale: "/kapcsolat" });
    expect(extractLocale("/")).toEqual({ locale: "hu", pathnameWithoutLocale: "/" });
  });

  it("ismeretlen prefix esetén nem vág le semmit", () => {
    expect(extractLocale("/fr/kapcsolat")).toEqual({ locale: "hu", pathnameWithoutLocale: "/fr/kapcsolat" });
  });

  it("minden oldal minden nyelven oda-vissza fordítható", () => {
    for (const page of PAGE_PATHNAMES) {
      for (const locale of LOCALES) {
        expect(extractLocale(localizeHref(locale, page))).toEqual({ locale, pathnameWithoutLocale: page });
      }
    }
  });

  it("egy nyelven belül nincs két oldalnak azonos URL-je", () => {
    for (const locale of LOCALES) {
      const urls = PAGE_PATHNAMES.map((page) => localizeHref(locale, page));
      expect(new Set(urls).size).toBe(urls.length);
    }
  });
});
