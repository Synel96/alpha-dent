// Generates public/sitemap.xml from lib/route-slugs.json, the same table
// lib/locale.ts routes with. Plain JS (with SITE_URL/LOCALES duplicated from
// lib/seo.ts and lib/locale.ts) so it runs with plain Node, no TS loader.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://alpha-dent.eu";
const LOCALES = ["hu", "en", "de", "it"];
const DEFAULT_LOCALE = "hu";
const ROUTE_SLUGS = JSON.parse(
  readFileSync(fileURLToPath(new URL("../lib/route-slugs.json", import.meta.url)), "utf8")
);

// The files a page's content comes from: its own directory (only the files
// directly in it - not a child page's) plus the translation file holding
// its texts. meta.ts (titles/descriptions) counts for every page.
const CONTENT_SOURCES = {
  "/": ["pages/index", "lib/i18n/common.ts"],
  "/klinikank": ["lib/i18n/clinic.ts"],
  "/szolgaltatasaink": ["lib/i18n/services.ts"],
  "/szolgaltatasaink/implantologia": ["lib/i18n/services.ts", "lib/lab-gallery.ts"],
  "/szolgaltatasaink/szajsebeszet": ["lib/i18n/services.ts"],
  "/szolgaltatasaink/esztetikai-fogaszat": ["lib/i18n/services.ts"],
  "/szolgaltatasaink/fogmegtarto-kezelesek": ["lib/i18n/services.ts"],
  "/kerdesek": ["lib/i18n/faq.ts"],
  "/kapcsolat": ["lib/i18n/contact.ts", "lib/clinic-info.ts", "lib/opening-hours.ts"],
  "/adatkezelesi-tajekoztato": ["lib/i18n/common.ts"],
};

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
const buildDate = new Date().toISOString().slice(0, 10);

// lastmod dates from the committed sitemap, keyed by <loc>. Vercel builds
// have no git history, so there these (computed by the last local build,
// which is committed) are used instead of stamping every page with the
// deploy date.
const previousLastmod = new Map();
try {
  const previous = readFileSync(outPath, "utf8");
  for (const [, loc, lastmod] of previous.matchAll(/<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/g)) {
    previousLastmod.set(loc, lastmod);
  }
} catch {
  // First run: no previous sitemap.
}

// <lastmod>: the date of the last commit that touched the page's content,
// so Google re-crawls exactly the pages that changed instead of seeing
// every page "updated" on every deploy. Without git history (Vercel, a
// shallow clone) it keeps the committed sitemap's date, and only a brand
// new URL falls back to today. Returns null when git can't answer.
function gitLastModified(pathname) {
  const pageDir = pathname === "/" ? null : `:(glob)pages${pathname}/*`;
  const sources = [...(pageDir ? [pageDir] : []), ...(CONTENT_SOURCES[pathname] ?? []), "lib/i18n/meta.ts"];
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...sources], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}

function localizeHref(locale, pathname) {
  const slug = ROUTE_SLUGS[pathname][locale];
  return `/${locale}${slug === "/" ? "" : slug}`;
}

function urlEntry(pathname) {
  const gitDate = gitLastModified(pathname);
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localizeHref(locale, pathname)}" />`
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizeHref(DEFAULT_LOCALE, pathname)}" />`;

  return LOCALES.map((locale) => {
    const loc = `${SITE_URL}${localizeHref(locale, pathname)}`;
    const lastmod = gitDate ?? previousLastmod.get(loc) ?? buildDate;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
${xDefault}
  </url>`;
  }).join("\n");
}

const missingSources = Object.keys(ROUTE_SLUGS).filter((pathname) => !CONTENT_SOURCES[pathname]);
if (missingSources.length > 0) {
  throw new Error(`generate-sitemap: add CONTENT_SOURCES for ${missingSources.join(", ")}`);
}

const body = Object.keys(ROUTE_SLUGS).map(urlEntry).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

writeFileSync(outPath, xml);
console.log(`sitemap.xml written to ${outPath}`);
