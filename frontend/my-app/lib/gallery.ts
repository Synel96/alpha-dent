// The gallery page's photos, by section. Each photo names the translation
// key of its alt text (also shown as the caption in the lightbox), so a
// photo can get its own caption just by pointing it at a new key.
//
// Empty for now - the photos come as Cloudinary links. A section without
// photos isn't shown; with none at all, the page shows a "coming soon" note.
export type GalleryPhoto = { src: string; altKey: string };
export type GallerySectionKey = "clinic" | "lab";
export type GallerySection = { key: GallerySectionKey; photos: GalleryPhoto[] };

export const GALLERY_SECTIONS: GallerySection[] = [
  { key: "clinic", photos: [] },
  { key: "lab", photos: [] },
];
