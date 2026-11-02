import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { CLINIC } from "../../lib/clinic-info";
import { LOCALES, PAGE_PATHNAMES, localizeHref } from "../../lib/locale";
import { SITE_URL } from "../../lib/seo";

// public/llms.txt is a hand-written summary of the site for AI tools
// (https://llmstxt.org). Lighthouse's "Agentic browsing" check wants an H1,
// enough text and at least one link; these tests also keep its links and
// contact details in step with the site.
const text = readFileSync(resolve(__dirname, "../../public/llms.txt"), "utf8");
const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(([, href]) => href);

describe("llms.txt", () => {
  it("egyetlen H1 címsorral kezdődik, utána összefoglaló idézetblokk", () => {
    expect(text.startsWith("# ")).toBe(true);
    expect(text.match(/^# /gm)).toHaveLength(1);
    expect(text).toMatch(/^> .{80,}/m);
  });

  it("minden linkje valódi oldalra (sitemap) vagy a klinika közösségi profiljára mutat", () => {
    const realUrls = new Set([
      ...PAGE_PATHNAMES.flatMap((pathname) => LOCALES.map((locale) => `${SITE_URL}${localizeHref(locale, pathname)}`)),
      `${SITE_URL}/sitemap.xml`,
      ...CLINIC.socialProfiles,
    ]);
    expect(links.length).toBeGreaterThan(5);
    for (const href of links) expect(realUrls, href).toContain(href);
  });

  it("a klinika címe, telefonszáma és e-mail-címe megegyezik a clinic-info adataival", () => {
    expect(text).toContain(CLINIC.streetAddress);
    expect(text).toContain(CLINIC.phoneDisplay);
    expect(text).toContain(CLINIC.email);
  });
});
