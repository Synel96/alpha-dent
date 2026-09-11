import React from "react";
import { cn } from "@/lib/utils";
import { cloudinaryUrl, cloudinarySrcSet } from "@/lib/cloudinary";
import { CtaButton } from "@/components/ui/cta-button";

// Layout's navbar reads this to fade from transparent (over the hero media)
// to fully opaque by the time the hero's bottom edge reaches the top of the
// viewport. A tiny external store (rather than a window CustomEvent) so
// useSyncExternalStore can hand the layout the correct value on its very
// first paint instead of racing Hero's mount effect. See pages/+Layout.tsx.
let heroProgress = 1;
const listeners = new Set<() => void>();

function setHeroProgress(value: number) {
  heroProgress = value;
  listeners.forEach((listener) => listener());
}

export function subscribeHeroProgress(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getHeroProgress() {
  return heroProgress;
}

export function getHeroProgressServerSnapshot() {
  return 1;
}

const HERO_IMAGE_WIDTHS = [640, 960, 1280, 1920, 2560] as const;

type HeroProps = {
  imageSrc: string;
  imageAlt?: string;
  // Swap in a looping background video later without touching the navbar
  // logic below - it only cares about the section's scroll position.
  videoSrc?: string;
  eyebrow?: string;
  quote?: React.ReactNode;
  brandMark?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  children?: React.ReactNode;
  className?: string;
};

export function Hero({
  imageSrc,
  imageAlt = "",
  videoSrc,
  eyebrow,
  quote,
  brandMark,
  subtitle,
  ctaHref,
  ctaLabel,
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
      setHeroProgress(progress);
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
      setHeroProgress(1);
    };
  }, []);

  const hasCopy = Boolean(quote || subtitle || eyebrow || (ctaHref && ctaLabel) || children);

  return (
    <section
      ref={sectionRef}
      // The header is `fixed` and adds matching top padding to <main> (see
      // pages/+Layout.tsx) so it can float transparently over page content
      // without pushing it down - Hero cancels that padding here so its
      // media fills the viewport from y=0, right behind the header.
      style={{ marginTop: "calc(-1 * var(--nav-height, 72px))" }}
      className={cn(
        "relative flex min-h-screen w-full items-center overflow-hidden bg-brand-black",
        hasCopy ? "justify-start" : "justify-center",
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
        {hasCopy ? (
          // Darken in from the left, where the copy sits - the right side
          // of the media stays untouched.
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/10 to-transparent" />
      </div>

      {hasCopy ? (
        <div className="relative z-10 flex max-w-xl flex-col items-start gap-5 px-6 text-left sm:px-10 lg:px-16">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.32em] text-brand-gold-light/90">
              {eyebrow}
            </p>
          ) : null}
          {quote ? (
            <h1
              style={{ fontFamily: '"Geist Variable", Georgia, "Times New Roman", serif' }}
              className="text-2xl italic font-light leading-snug text-brand-gold-light md:text-4xl"
            >
              {quote}
            </h1>
          ) : null}
          {brandMark ? (
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-gold">
              {brandMark}
            </p>
          ) : null}
          {subtitle ? (
            <p className="max-w-2xl text-sm text-brand-gold-muted md:text-base">{subtitle}</p>
          ) : null}
          {ctaHref && ctaLabel ? (
            <CtaButton href={ctaHref} title={ctaLabel} variant="ghost" className="mt-1" />
          ) : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}
