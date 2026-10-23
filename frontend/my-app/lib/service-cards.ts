// The four service cards, shared by the home page's services carousel and
// the services hub (pages/szolgaltatasaink) so both always show the same
// photo for the same service.
export const SERVICE_SLUGS = [
  "implantologia",
  "szajsebeszet",
  "esztetikaiFogaszat",
  "fogmegtartoKezelesek",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const SERVICE_PATHS: Record<ServiceSlug, string> = {
  implantologia: "/szolgaltatasaink/implantologia",
  szajsebeszet: "/szolgaltatasaink/szajsebeszet",
  esztetikaiFogaszat: "/szolgaltatasaink/esztetikai-fogaszat",
  fogmegtartoKezelesek: "/szolgaltatasaink/fogmegtarto-kezelesek",
};

export const SERVICE_IMAGES: Partial<Record<ServiceSlug, string>> = {
  implantologia: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789221230/Alphadent_portfolio_0053_gz8nis.webp",
  szajsebeszet: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789215806/IMG_3398_dmrstv.webp",
  esztetikaiFogaszat: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp",
  // The Raypex 6 apex locator, also shown on the tooth-preserving treatments page.
  fogmegtartoKezelesek:
    "https://res.cloudinary.com/dmwulp3dl/image/upload/v1792599192/file_000000009df081f4ba4fcf9374c1c1ee_v5ffwt.webp",
};
