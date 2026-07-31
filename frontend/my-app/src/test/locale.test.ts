import { describe, it, expect } from "vitest";
import { DEFAULT_LOCALE, LOCALES, extractLocale, localizeHref } from "../../lib/locale";

describe("extractLocale", () => {
  it("alapértelmezett nyelvre (hu) áll, ha nincs prefix a gyökér útvonalon", () => {
    expect(extractLocale("/")).toEqual({ locale: "hu", pathnameWithoutLocale: "/" });
  });

  it("alapértelmezett nyelvre áll, ha nincs prefix egy aloldalon", () => {
    expect(extractLocale("/kapcsolat")).toEqual({
      locale: "hu",
      pathnameWithoutLocale: "/kapcsolat",
    });
  });

  it("felismeri az /en prefixet a gyökér útvonalon", () => {
    expect(extractLocale("/en")).toEqual({ locale: "en", pathnameWithoutLocale: "/" });
  });

  it("felismeri az /en prefixet és levágja egy aloldalnál", () => {
    expect(extractLocale("/en/kapcsolat")).toEqual({
      locale: "en",
      pathnameWithoutLocale: "/kapcsolat",
    });
  });

  it("felismeri a /de és /it prefixeket is", () => {
    expect(extractLocale("/de/kerdesek").locale).toBe("de");
    expect(extractLocale("/it/szolgaltatasaink").locale).toBe("it");
  });

  it("a /hu prefixet NEM kezeli külön prefixként (az alapértelmezett nyelv prefix nélküli)", () => {
    // A hivatalos Vike i18n minta szerint az alapértelmezett nyelvnek nincs
    // prefixe, így a "/hu/..." útvonal nem egyezik egyetlen oldallal sem.
    expect(extractLocale("/hu/kapcsolat")).toEqual({
      locale: "hu",
      pathnameWithoutLocale: "/hu/kapcsolat",
    });
  });

  it("ismeretlen prefix esetén alapértelmezett nyelvre áll, és nem vágja le az útvonalat", () => {
    expect(extractLocale("/fr/kapcsolat")).toEqual({
      locale: "hu",
      pathnameWithoutLocale: "/fr/kapcsolat",
    });
  });
});

describe("localizeHref", () => {
  it("az alapértelmezett nyelvhez (hu) nem tesz prefixet", () => {
    expect(localizeHref(DEFAULT_LOCALE, "/kapcsolat")).toBe("/kapcsolat");
    expect(localizeHref(DEFAULT_LOCALE, "/")).toBe("/");
  });

  it("nem alapértelmezett nyelvekhez prefixet tesz", () => {
    expect(localizeHref("en", "/kapcsolat")).toBe("/en/kapcsolat");
    expect(localizeHref("de", "/kerdesek")).toBe("/de/kerdesek");
    expect(localizeHref("it", "/szolgaltatasaink")).toBe("/it/szolgaltatasaink");
  });

  it("a gyökér útvonalhoz nem told dupla perjelet", () => {
    expect(localizeHref("en", "/")).toBe("/en");
  });

  it("extractLocale-lel körbeérve visszaadja az eredeti (nem-alapértelmezett) útvonalat", () => {
    for (const locale of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
      const href = localizeHref(locale, "/kapcsolat");
      expect(extractLocale(href)).toEqual({ locale, pathnameWithoutLocale: "/kapcsolat" });
    }
  });
});
