import React from "react";
import { cn } from "@/lib/utils";

type ServiceTileProps = {
  title: string;
  imageUrl?: string;
  className?: string;
  delayMs?: number;
};

export function ServiceTile({
  title,
  imageUrl,
  className,
  delayMs = 0,
}: ServiceTileProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
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
          <h3 className="inline-block rounded-md border border-brand-gold/35 bg-brand-black/70 px-2.5 py-1.5 text-sm font-semibold leading-snug text-brand-gold-light md:text-base">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}
