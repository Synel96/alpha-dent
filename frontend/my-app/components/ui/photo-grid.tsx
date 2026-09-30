import { cloudinarySrcSet, cloudinaryUrl, TILE_IMAGE_WIDTHS } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export type GridPhoto = { src: string; alt: string };

type PhotoGridProps = {
  photos: GridPhoto[];
  columns?: 2 | 3;
  className?: string;
};

export function PhotoGrid({ photos, columns = 3, className }: PhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        className
      )}
    >
      {photos.map((photo) => (
        <img
          key={photo.src}
          src={cloudinaryUrl(photo.src, { width: 800 })}
          srcSet={cloudinarySrcSet(photo.src, TILE_IMAGE_WIDTHS)}
          sizes={columns === 3 ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
          alt={photo.alt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          className="aspect-[4/3] w-full rounded-2xl border border-brand-gold/25 object-cover shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)]"
        />
      ))}
    </div>
  );
}
