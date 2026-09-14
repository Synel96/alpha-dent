import React from "react";
import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

const GALLERY_IMAGE_WIDTHS = [480, 640, 960] as const;

type GalleryImage = {
  src: string;
  alt: string;
};

type AutoGalleryProps = {
  images: GalleryImage[];
  className?: string;
};

// Horizontal, auto-scrolling strip of clinic photos. The scroll animation
// only starts once the strip is actually on screen (IntersectionObserver),
// so it costs nothing on first paint, and never starts at all under
// prefers-reduced-motion - the images themselves (native loading="lazy")
// still show up, just as a static row.
export function AutoGallery({ images, className }: AutoGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Duplicated so the strip can loop by scrolling exactly one copy's width
  // (see the gallery-scroll keyframes in pages/Layout.css) instead of
  // snapping back to the start.
  const track = [...images, ...images];

  return (
    <div ref={rootRef} className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max gap-4",
          active && "[animation:gallery-scroll_40s_linear_infinite] hover:[animation-play-state:paused]"
        )}
      >
        {track.map((image, index) => (
          <div
            key={index}
            aria-hidden={index >= images.length}
            className="h-56 w-72 shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface/60 shadow-[0_18px_36px_-24px_rgba(201,168,76,0.4)] sm:h-64 sm:w-96"
          >
            <img
              src={cloudinaryUrl(image.src, { width: 640 })}
              srcSet={cloudinarySrcSet(image.src, GALLERY_IMAGE_WIDTHS)}
              sizes="(min-width: 640px) 384px, 288px"
              alt={index >= images.length ? "" : image.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
