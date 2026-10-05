import React from "react";
import { useTranslation } from "react-i18next";
import { cloudinarySrcSet, cloudinaryUrl, TILE_IMAGE_WIDTHS } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { Lightbox, ZoomBadge } from "./lightbox";

export type GridPhoto = { src: string; alt: string };

type PhotoGridProps = {
  photos: GridPhoto[];
  columns?: 2 | 3;
  className?: string;
};

// Each tile opens the Lightbox, which can then page through the whole grid.
export function PhotoGrid({ photos, columns = 3, className }: PhotoGridProps) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          columns === 3 && "lg:grid-cols-3",
          className
        )}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-label={t("common.lightbox.open", { alt: photo.alt })}
            onClick={() => setOpenIndex(index)}
            className="group relative block cursor-zoom-in overflow-hidden rounded-2xl border border-brand-gold/25 shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)] transition-colors hover:border-brand-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
          >
            <img
              src={cloudinaryUrl(photo.src, { width: 800 })}
              srcSet={cloudinarySrcSet(photo.src, TILE_IMAGE_WIDTHS)}
              sizes={columns === 3 ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
              alt={photo.alt}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              crossOrigin="anonymous"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <ZoomBadge />
          </button>
        ))}
      </div>
      <Lightbox images={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  );
}
