import { cn } from "@/lib/utils";
import { cloudinarySrcSet, cloudinaryUrl, THUMBNAIL_QUALITY, TILE_IMAGE_WIDTHS } from "@/lib/cloudinary";
import { useReveal } from "@/lib/use-reveal";
import { ImageSkeleton, useImageLoaded } from "./image-skeleton";

// Default: the services hub grid (1 / 2 / 4 columns). Carousels pass their own.
const TILE_SIZES = "(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 48vw, 92vw";
const TILE_IMAGE = { aspectRatio: "4:3", quality: THUMBNAIL_QUALITY } as const;

type ServiceTileProps = {
  title: string;
  href: string;
  imageUrl?: string;
  className?: string;
  delayMs?: number;
  // 3 under a section heading (homepage), 2 when the tiles sit straight
  // under the page's h1 (services hub) - keeps the heading outline gapless.
  headingLevel?: 2 | 3;
  // The tile's rendered width, for the image's `sizes` (see TILE_SIZES).
  sizes?: string;
};

export function ServiceTile({
  title,
  href,
  imageUrl,
  className,
  delayMs = 0,
  headingLevel = 3,
  sizes = TILE_SIZES,
}: ServiceTileProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const { ref: rootRef, visible } = useReveal<HTMLElement>({ threshold: 0.2 });
  const image = useImageLoaded();

  return (
    <article
      ref={rootRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "group rounded-2xl border border-brand-gold/25 bg-brand-surface/85 p-2 shadow-[0_12px_28px_-18px_rgba(201,168,76,0.45)]",
        "hover:-translate-y-1 hover:border-brand-gold/55 hover:shadow-[0_18px_34px_-14px_rgba(201,168,76,0.65)]",
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-100",
        className
      )}
    >
      <a
        href={href}
        className="relative block w-full aspect-[4/3] overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
      >
        {imageUrl ? <ImageSkeleton visible={!image.loaded} /> : null}
        {imageUrl ? (
          <img
            ref={image.ref}
            onLoad={image.onLoad}
            onError={image.onError}
            src={cloudinaryUrl(imageUrl, { width: TILE_IMAGE_WIDTHS.at(-1), ...TILE_IMAGE })}
            srcSet={cloudinarySrcSet(imageUrl, TILE_IMAGE_WIDTHS, TILE_IMAGE)}
            sizes={sizes}
            // Decorative: the tile's heading already names the service, and a
            // repeated alt would just be read out twice.
            alt=""
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(228,196,106,0.3),transparent_40%),linear-gradient(140deg,rgba(17,17,20,0.98),rgba(8,8,10,0.96))]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/96 via-brand-black/45 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        {!imageUrl ? (
          <p className="absolute right-3 top-3 rounded-full border border-brand-gold/35 bg-brand-black/55 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-brand-gold-muted">
            Cloudinary placeholder
          </p>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <Heading className="inline-block rounded-md border border-brand-gold/35 bg-brand-black/70 px-2.5 py-1.5 text-sm font-semibold leading-snug text-brand-gold-light md:text-base">
            {title}
          </Heading>
        </div>
      </a>
    </article>
  );
}
