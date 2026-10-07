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
      <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.85em' x='0.08em' font-size='82' fill='%23C9A84C'%3E%CE%B1%3C/text%3E%3C/svg%3E" />
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
