// Thin helper around Cloudinary's URL-based transformations, so components
// only need a plain Cloudinary delivery URL (e.g.
// "https://res.cloudinary.com/<cloud>/image/upload/<public_id>.jpg") and get
// responsive, optimized images for free once the real media lands.
// https://cloudinary.com/documentation/transformation_reference

const UPLOAD_MARKER = "/upload/";

export type CloudinaryTransformOptions = {
  width?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
  gravity?: string;
  quality?: "auto" | number;
  format?: "auto" | string;
};

function isCloudinaryUrl(url: string): boolean {
  return url.includes(UPLOAD_MARKER);
}

export function cloudinaryUrl(url: string, options: CloudinaryTransformOptions = {}): string {
  if (!isCloudinaryUrl(url)) return url;

  const { width, crop = "fill", gravity = "auto", quality = 78, format = "auto" } = options;
  const transform = [
    width ? `w_${width}` : null,
    width ? `c_${crop}` : null,
    width ? `g_${gravity}` : null,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter((part): part is string => part !== null)
    .join(",");

  const insertAt = url.indexOf(UPLOAD_MARKER) + UPLOAD_MARKER.length;
  return `${url.slice(0, insertAt)}${transform}/${url.slice(insertAt)}`;
}

export function cloudinarySrcSet(
  url: string,
  widths: readonly number[],
  options: Omit<CloudinaryTransformOptions, "width"> = {}
): string | undefined {
  if (!isCloudinaryUrl(url)) return undefined;
  return widths.map((width) => `${cloudinaryUrl(url, { ...options, width })} ${width}w`).join(", ");
}

// Roughly matched to the grids these widths are used in (see
// ServiceTile/szolgaltatasaink and TextImageReveal usages).
export const TILE_IMAGE_WIDTHS = [400, 600, 800] as const;
export const REVEAL_IMAGE_WIDTHS = [480, 768, 960] as const;
