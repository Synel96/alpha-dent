import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";

const BACKGROUND_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790176310/file_0000000080d4820cb7cf66387d3ca811_mquvzb.png";

const BACKGROUND_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;

// Heavily darkened by the overlay, so a lower quality than the default is invisible.
const BACKGROUND_QUALITY = 60;

// Must render outside <PushDrawerBody>: its always-on transform would turn
// `position: fixed` into "fixed to the body" and the background would scroll.
// h-lvh (not inset-0) keeps it from resizing when the mobile URL bar toggles.
export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-lvh">
      <img
        src={cloudinaryUrl(BACKGROUND_IMAGE, { width: 1280, quality: BACKGROUND_QUALITY })}
        srcSet={cloudinarySrcSet(BACKGROUND_IMAGE, BACKGROUND_IMAGE_WIDTHS, {
          quality: BACKGROUND_QUALITY,
        })}
        sizes="100vw"
        alt=""
        decoding="async"
        fetchPriority="low"
        crossOrigin="anonymous"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-black/60" />
    </div>
  );
}
