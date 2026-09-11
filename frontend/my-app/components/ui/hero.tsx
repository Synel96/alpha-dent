import React from "react";
import { cn } from "@/lib/utils";
import { cloudinaryUrl, cloudinarySrcSet } from "@/lib/cloudinary";

// Layout's navbar listens for this to fade from transparent (over the hero
// media) to fully opaque by the time the hero's bottom edge reaches the top
// of the viewport. See pages/+Layout.tsx.
export const HERO_SCROLL_EVENT = "alphadent:hero-scroll";

export type HeroScrollEventDetail = { progress: number };

const HERO_IMAGE_WIDTHS = [640, 960, 1280, 1920, 2560] as const;

type HeroProps = {
  imageSrc: string;
  imageAlt?: string;
  // Swap in a looping background video later without touching the navbar
  // logic below - it only cares about the section's scroll position.
  videoSrc?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function Hero({
  imageSrc,
  imageAlt = "",
  videoSrc,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: HeroProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const emitProgress = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const progress = rect.height > 0 ? Math.min(1, Math.max(0, -rect.top / rect.height)) : 1;
      window.dispatchEvent(
        new CustomEvent<HeroScrollEventDetail>(HERO_SCROLL_EVENT, { detail: { progress } })
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(emitProgress);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      // Leaving the hero page (client-side nav) - hand the navbar back its
      // default fully-opaque state.
      window.dispatchEvent(
        new CustomEvent<HeroScrollEventDetail>(HERO_SCROLL_EVENT, { detail: { progress: 1 } })
      );
    };
  }, []);

  const hasCopy = Boolean(title || subtitle || eyebrow || children);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-brand-black",
        className
      )}
    >
      <div className="absolute inset-0">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={cloudinaryUrl(imageSrc, { width: 1920 })}
            srcSet={cloudinarySrcSet(imageSrc, HERO_IMAGE_WIDTHS)}
            sizes="100vw"
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/10 to-transparent" />
      </div>

      {hasCopy ? (
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.32em] text-brand-gold-light/90">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="text-3xl font-semibold text-brand-gold-light md:text-5xl">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="max-w-2xl text-sm text-brand-gold-muted md:text-base">{subtitle}</p>
          ) : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}
