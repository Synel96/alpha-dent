import { describe, it, expect } from "vitest";
import { absoluteLocalizedUrl, hreflangAlternates, SITE_URL } from "../../lib/seo";

describe("absoluteLocalizedUrl", () => {
  it("a magyar oldalhoz /hu prefixelt, teljes URL-t ad", () => {
    expect(absoluteLocalizedUrl("hu", "/kapcsolat")).toBe(`${SITE_URL}/hu/kapcsolat`);
  });

  it("más nyelvhez a lefordított, prefixelt URL-t adja", () => {
    expect(absoluteLocalizedUrl("en", "/kapcsolat")).toBe(`${SITE_URL}/en/contact`);
  });
});

describe("hreflangAlternates", () => {
  it("mind a 4 nyelvhez, plusz x-default-hoz ad egy-egy bejegyzést", () => {
    const hreflangs = hreflangAlternates("/kapcsolat").map((a) => a.hreflang).sort();
    expect(hreflangs).toEqual(["de", "en", "hu", "it", "x-default"].sort());
  });

  it("minden nyelv a saját lefordított URL-jére mutat", () => {
    const byLang = Object.fromEntries(hreflangAlternates("/kapcsolat").map((a) => [a.hreflang, a.href]));
    expect(byLang.hu).toBe(`${SITE_URL}/hu/kapcsolat`);
    expect(byLang.en).toBe(`${SITE_URL}/en/contact`);
    expect(byLang.de).toBe(`${SITE_URL}/de/kontakt`);
    expect(byLang.it).toBe(`${SITE_URL}/it/contatti`);
  });

  it("az x-default a magyar változatra mutat, mert a gyökér oda irányít", () => {
    const xDefault = hreflangAlternates("/kapcsolat").find((a) => a.hreflang === "x-default");
    expect(xDefault?.href).toBe(`${SITE_URL}/hu/kapcsolat`);
  });
});
