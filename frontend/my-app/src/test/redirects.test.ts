import { describe, it, expect } from "vitest";
import { LOCALES, PAGE_PATHNAMES, localizeHref } from "../../lib/locale";
import { SITE_URL } from "../../lib/seo";
import vercelConfig from "../../vercel.json";

// Redirects of the old alpha-dent-three.vercel.app address to the domain
// (matched by host), and the path redirects within the site.
const domainRedirects = vercelConfig.redirects.filter((redirect) => "has" in redirect);
const pathRedirects = vercelConfig.redirects.filter((redirect) => !("has" in redirect));

const validUrls = new Set(
  PAGE_PATHNAMES.flatMap((page) => LOCALES.map((locale) => localizeHref(locale, page)))
);

describe("vercel.json átirányítások", () => {
  it("minden átirányítás egy létező, lefordított oldalra mutat, és végleges (301/308)", () => {
    for (const redirect of pathRedirects) {
      expect(validUrls, `${redirect.source} -> ${redirect.destination}`).toContain(redirect.destination);
      expect(redirect.permanent).toBe(true);
    }
  });

  it("a gyökér a magyar főoldalra irányít", () => {
    expect(pathRedirects).toContainEqual({ source: "/", destination: "/hu", permanent: true });
  });

  it("minden régi, prefix nélküli magyar URL át van irányítva", () => {
    const sources = new Set(pathRedirects.map((r) => r.source));
    for (const page of PAGE_PATHNAMES) {
      expect(sources).toContain(page);
    }
  });

  it("egyetlen átirányítás sem mutat saját magára vagy egy másik átirányított címre", () => {
    const sources = new Set(pathRedirects.map((r) => r.source));
    for (const redirect of pathRedirects) {
      expect(sources.has(redirect.destination)).toBe(false);
    }
  });

  it("a régi vercel.app cím minden oldala véglegesen az alpha-dent.eu ugyanazon oldalára irányít", () => {
    expect(domainRedirects).toEqual([
      {
        source: "/",
        has: [{ type: "host", value: "alpha-dent-three.vercel.app" }],
        destination: `${SITE_URL}/hu`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "alpha-dent-three.vercel.app" }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ]);
    // First, so they win over the path redirects (Vercel applies the first match).
    expect(vercelConfig.redirects.slice(0, 2)).toEqual(domainRedirects);
  });
});
