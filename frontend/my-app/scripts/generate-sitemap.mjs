// Generates public/sitemap.xml from the same locale/page structure as
// lib/locale.ts (LOCALES, DEFAULT_LOCALE, PAGE_PATHNAMES) and lib/seo.ts
// (SITE_URL). Kept as plain JS (duplicating those small constants) so it
// can run with plain Node, without a TypeScript loader.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://alpha-dent.eu";
const LOCALES = ["hu", "en", "de", "it"];
const DEFAULT_LOCALE = "hu";
const PAGE_PATHNAMES = [
  "/",
  "/klinikank",
  "/szolgaltatasaink",
  "/szolgaltatasaink/implantologia",
  "/szolgaltatasaink/szajsebeszet",
  "/szolgaltatasaink/esztetikai-fogaszat",
  "/szolgaltatasaink/fogmegtarto-kezelesek",
  "/tortenetunk",
  "/kerdesek",
  "/kapcsolat",
];

function localizeHref(locale, pathname) {
  if (locale === DEFAULT_LOCALE) return pathname;
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

function urlEntry(pathname) {
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localizeHref(locale, pathname)}" />`
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathname}" />`;

  return LOCALES.map(
    (locale) => `  <url>
    <loc>${SITE_URL}${localizeHref(locale, pathname)}</loc>
${alternates}
${xDefault}
  </url>`
  ).join("\n");
}

const body = PAGE_PATHNAMES.map(urlEntry).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(`sitemap.xml written to ${outPath}`);
