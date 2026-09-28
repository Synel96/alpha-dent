import { describe, it, expect } from "vitest";
import { LOCALES, PAGE_PATHNAMES, localizeHref } from "../../lib/locale";
import vercelConfig from "../../vercel.json";

const validUrls = new Set(
  PAGE_PATHNAMES.flatMap((page) => LOCALES.map((locale) => localizeHref(locale, page)))
);

describe("vercel.json átirányítások", () => {
  it("minden átirányítás egy létező, lefordított oldalra mutat, és végleges (301/308)", () => {
    for (const redirect of vercelConfig.redirects) {
      expect(validUrls, `${redirect.source} -> ${redirect.destination}`).toContain(redirect.destination);
      expect(redirect.permanent).toBe(true);
    }
  });

  it("a gyökér a magyar főoldalra irányít", () => {
    expect(vercelConfig.redirects).toContainEqual({ source: "/", destination: "/hu", permanent: true });
  });

  it("minden régi, prefix nélküli magyar URL át van irányítva", () => {
    const sources = new Set(vercelConfig.redirects.map((r) => r.source));
    for (const page of PAGE_PATHNAMES) {
      expect(sources).toContain(page);
    }
  });

  it("egyetlen átirányítás sem mutat saját magára vagy egy másik átirányított címre", () => {
    const sources = new Set(vercelConfig.redirects.map((r) => r.source));
    for (const redirect of vercelConfig.redirects) {
      expect(sources.has(redirect.destination)).toBe(false);
    }
  });
});
