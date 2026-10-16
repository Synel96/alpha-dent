// The gallery page's photos, by section. Each photo names the translation
// key of its alt text (also shown as the caption in the lightbox), so a
// photo can get its own caption just by pointing it at a new key.
//
// A section without photos isn't shown; with a single non-empty section
// there are no tabs, and with none at all the page shows a "coming soon" note.
export type GalleryPhoto = { src: string; altKey: string };
export type GallerySectionKey = "clinic" | "lab";
export type GallerySection = { key: GallerySectionKey; photos: GalleryPhoto[] };

const CLOUDINARY = "https://res.cloudinary.com/dmwulp3dl/image/upload";

export const GALLERY_SECTIONS: GallerySection[] = [
  // The clinic's own photos are in the Klinikánk carousel for now.
  { key: "clinic", photos: [] },
  {
    key: "lab",
    // In the order the clinic chose: the machines first, then the handwork.
    photos: [
      { src: `${CLOUDINARY}/v1792171084/Alphadent_fogtechnika_2026_0049_upivgg.webp`, altKey: "galleryPage.photos.milling5Sinter" },
      { src: `${CLOUDINARY}/v1792171084/Alphadent_fogtechnika_2026_0043_bfwreq.webp`, altKey: "galleryPage.photos.milling1And4" },
      { src: `${CLOUDINARY}/v1792171084/Alphadent_fogtechnika_2026_0041_tva3mz.webp`, altKey: "galleryPage.photos.aiditeMill" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0002_ljlkjl.webp`, altKey: "galleryPage.photos.emptyHolder" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0004_xw2ih7.webp`, altKey: "galleryPage.photos.milledDisc" },
      { src: `${CLOUDINARY}/v1792171088/Alphadent_fogtechnika_2026_0024_zlxer1.webp`, altKey: "galleryPage.photos.milledDiscAngle" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0031_v5l4a6.webp`, altKey: "galleryPage.photos.frameworkFinishing" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0214_gp7d8q.webp`, altKey: "galleryPage.photos.fullArchDisc" },
      { src: `${CLOUDINARY}/v1792171089/Alphadent_fogtechnika_2026_0098_mitvre.webp`, altKey: "galleryPage.photos.finishedFrameworks" },
      { src: `${CLOUDINARY}/v1792171088/Alphadent_fogtechnika_2026_0243_o5anpo.webp`, altKey: "galleryPage.photos.anteriorCrownsDisc" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0139_dukd1y.webp`, altKey: "galleryPage.photos.bridgeShading" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0054_vwz9gz.webp`, altKey: "galleryPage.photos.modelScan" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0188_eehizx.webp`, altKey: "galleryPage.photos.ceramicApplication" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0175_liws8q.webp`, altKey: "galleryPage.photos.smallBridgeStain" },
      { src: `${CLOUDINARY}/v1792171087/Alphadent_fogtechnika_2026_0215_wy0tvf.webp`, altKey: "galleryPage.photos.fullArchBench" },
      { src: `${CLOUDINARY}/v1792171086/Alphadent_fogtechnika_2026_0285_ieat9r.webp`, altKey: "galleryPage.photos.crownRow" },
      { src: `${CLOUDINARY}/v1792171086/Alphadent_fogtechnika_2026_0203_uu3bzw.webp`, altKey: "galleryPage.photos.bridgeBehindShield" },
      { src: `${CLOUDINARY}/v1792171086/Alphadent_fogtechnika_2026_0134_czmuaw.webp`, altKey: "galleryPage.photos.gumPainting" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0065_jiur9e.webp`, altKey: "galleryPage.photos.molarShaping" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0173_lmtuqo.webp`, altKey: "galleryPage.photos.anteriorGrinding" },
      { src: `${CLOUDINARY}/v1792171085/Alphadent_fogtechnika_2026_0158_agkvkd.webp`, altKey: "galleryPage.photos.glossyBridge" },
      { src: `${CLOUDINARY}/v1792171084/Alphadent_fogtechnika_2026_0176_cjrf3r.webp`, altKey: "galleryPage.photos.firedBridges" },
    ],
  },
];
