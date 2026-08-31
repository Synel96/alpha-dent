import { describe, it, expect } from "vitest";
import { absoluteLocalizedUrl, hreflangAlternates, dentistJsonLd, SITE_URL } from "../../lib/seo";
import { COMPANY_INFO } from "../../lib/company";

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

describe("dentistJsonLd", () => {
  it("a schema.org Dentist típust és a COMPANY_INFO adatait adja vissza", () => {
    const jsonLd = dentistJsonLd();

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Dentist");
    expect(jsonLd.name).toBe(COMPANY_INFO.brandName);
    expect(jsonLd.legalName).toBe(COMPANY_INFO.legalName);
    expect(jsonLd.url).toBe(SITE_URL);
    expect(jsonLd.telephone).toBe("+3699788888");
    expect(jsonLd.email).toBe(COMPANY_INFO.email);
  });

  it("strukturált címet és GPS koordinátákat tartalmaz", () => {
    const jsonLd = dentistJsonLd();

    expect(jsonLd.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.addressComponents.streetAddress,
      addressLocality: COMPANY_INFO.addressComponents.addressLocality,
      postalCode: COMPANY_INFO.addressComponents.postalCode,
      addressCountry: COMPANY_INFO.addressComponents.addressCountry,
    });
    expect(jsonLd.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: COMPANY_INFO.geo.latitude,
      longitude: COMPANY_INFO.geo.longitude,
    });
  });
});
