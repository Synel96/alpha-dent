import { usePageContext } from "vike-react/usePageContext";
import { CLINIC } from "../lib/clinic-info";
import {
  absoluteLocalizedUrl,
  hreflangAlternates,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  ogLocale,
  ogLocaleAlternates,
} from "../lib/seo";
import { clinicStructuredData, serializeJsonLd } from "../lib/structured-data";

const FONT_PRELOADS = [
  "/fonts/geist-5.2.9-latin-wght-normal.woff2",
  "/fonts/geist-5.2.9-latin-wght-italic.woff2",
  "/fonts/geist-5.2.9-latin-ext-wght-normal.woff2",
];

// og:title, og:description and og:image/twitter:card come from vike-react
// itself (see +title.ts, +description.ts, +image.ts); the rest of the link
// preview and the schema.org markup are added here.
export function Head() {
  const { locale, urlPathname } = usePageContext();
  const canonical = absoluteLocalizedUrl(locale, urlPathname);

  return (
    <>
      <meta name="theme-color" content="#08080a" />
      {/* All photos come from Cloudinary: open that connection right away
          (crossOrigin to match the images' CORS mode, or it's not reused),
          instead of only when the parser reaches the hero image. */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      {/* Only the fonts the first screen needs: regular + italic (the hero
          quote, the LCP text on mobile) latin, and regular latin-ext for
          ő/ű. latin-ext italic loads on demand via unicode-range. */}
      {FONT_PRELOADS.map((href) => (
        <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
      ))}
      {/* The clinic's logo mark: favicon.ico for browsers and crawlers that
          only look at the site root, the SVG for the rest, a PNG for iOS
          home screens. ?v= makes browsers drop a cached older icon - bump it
          whenever the icons change. */}
      <link rel="icon" href="/favicon.ico?v=2" sizes="32x32" />
      <link rel="icon" href="/brand/favicon.svg?v=2" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png?v=2" />
      <link rel="canonical" href={canonical} />
      {hreflangAlternates(urlPathname).map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={CLINIC.name} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={ogLocale(locale)} />
      {ogLocaleAlternates(locale).map((alternate) => (
        <meta key={alternate} property="og:locale:alternate" content={alternate} />
      ))}
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(clinicStructuredData(locale)) }}
      />
    </>
  );
}
