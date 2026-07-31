import { describe, it, expect } from "vitest";
import { absoluteLocalizedUrl, hreflangAlternates, SITE_URL } from "../../lib/seo";

describe("absoluteLocalizedUrl", () => {
  it("az alapértelmezett nyelvhez prefix nélküli, teljes URL-t ad", () => {
    expect(absoluteLocalizedUrl("hu", "/kapcsolat")).toBe(`${SITE_URL}/kapcsolat`);
  });

  it("nem alapértelmezett nyelvhez prefixelt, teljes URL-t ad", () => {
    expect(absoluteLocalizedUrl("en", "/kapcsolat")).toBe(`${SITE_URL}/en/kapcsolat`);
  });
});

describe("hreflangAlternates", () => {
  it("mind a 4 nyelvhez, plusz x-default-hoz ad egy-egy bejegyzést", () => {
    const alternates = hreflangAlternates("/kapcsolat");
    const hreflangs = alternates.map((a) => a.hreflang).sort();
    expect(hreflangs).toEqual(["de", "en", "hu", "it", "x-default"].sort());
  });

  it("a hu bejegyzés prefix nélküli URL-re mutat", () => {
    const hu = hreflangAlternates("/kapcsolat").find((a) => a.hreflang === "hu");
    expect(hu?.href).toBe(`${SITE_URL}/kapcsolat`);
  });

  it("az en bejegyzés /en prefixelt URL-re mutat", () => {
    const en = hreflangAlternates("/kapcsolat").find((a) => a.hreflang === "en");
    expect(en?.href).toBe(`${SITE_URL}/en/kapcsolat`);
  });

  it("az x-default a nyelv-semleges (prefix nélküli) URL-re mutat", () => {
    const xDefault = hreflangAlternates("/kapcsolat").find((a) => a.hreflang === "x-default");
    expect(xDefault?.href).toBe(`${SITE_URL}/kapcsolat`);
  });
});
