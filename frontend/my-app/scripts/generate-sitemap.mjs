// Generates public/sitemap.xml from lib/route-slugs.json, the same table
// lib/locale.ts routes with. Plain JS (with SITE_URL/LOCALES duplicated from
// lib/seo.ts and lib/locale.ts) so it runs with plain Node, no TS loader.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://alpha-dent.eu";
const LOCALES = ["hu", "en", "de", "it"];
const DEFAULT_LOCALE = "hu";
const ROUTE_SLUGS = JSON.parse(
  readFileSync(fileURLToPath(new URL("../lib/route-slugs.json", import.meta.url)), "utf8")
);

function localizeHref(locale, pathname) {
  const slug = ROUTE_SLUGS[pathname][locale];
  return `/${locale}${slug === "/" ? "" : slug}`;
}

function urlEntry(pathname) {
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localizeHref(locale, pathname)}" />`
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizeHref(DEFAULT_LOCALE, pathname)}" />`;

  return LOCALES.map(
    (locale) => `  <url>
    <loc>${SITE_URL}${localizeHref(locale, pathname)}</loc>
${alternates}
${xDefault}
  </url>`
  ).join("\n");
}

const body = Object.keys(ROUTE_SLUGS).map(urlEntry).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(`sitemap.xml written to ${outPath}`);
