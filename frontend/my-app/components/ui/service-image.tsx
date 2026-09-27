import { cloudinarySrcSet, cloudinaryUrl, REVEAL_IMAGE_WIDTHS } from "@/lib/cloudinary";

type ServiceImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function ServiceImage({ src, alt, caption }: ServiceImageProps) {
  return (
    <figure>
      <img
        src={cloudinaryUrl(src, { width: 960 })}
        srcSet={cloudinarySrcSet(src, REVEAL_IMAGE_WIDTHS)}
        sizes="(min-width: 768px) 50vw, 100vw"
        alt={alt}
        width={960}
        height={640}
        decoding="async"
        crossOrigin="anonymous"
        className="aspect-[3/2] w-full rounded-2xl border border-brand-gold/25 object-cover shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)]"
      />
      {caption ? (
        <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-brand-gold-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
