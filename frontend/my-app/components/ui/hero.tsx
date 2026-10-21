import React from "react";
import { Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { cloudinaryUrl, cloudinarySrcSet, cloudinaryVideoUrl } from "@/lib/cloudinary";
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

const HERO_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;
// Phones get a lighter rendition of the background video.
const HERO_VIDEO_WIDTH = { small: 1280, large: 1920 } as const;

type VideoSource = { src: string; type: string };

// Whether to fetch the background video at all: never for visitors who ask
// for less motion or less data - they keep the still photo.
function wantsHeroVideo(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData;
}

// Runs `callback` once the page has fully loaded (and the browser is idle),
// so the video never competes with the photo, fonts and scripts the first
// screen needs - the photo stays the LCP element.
function afterPageLoad(callback: () => void): () => void {
  let cancelled = false;
  let idleHandle: number | undefined;
  const run = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      idleHandle = window.setTimeout(callback, 200);
    }
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleHandle !== undefined) {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
    }
  };
}

type HeroProps = {
  imageSrc: string;
  imageAlt?: string;
  // Looping background video (a Cloudinary video URL), faded in over the
  // photo once it can play. imageSrc stays the first paint (LCP), the still
  // while the video loads, and the fallback for reduced motion / data saver.
  videoSrc?: string;
  eyebrow?: string;
  quote?: React.ReactNode;
  // Rendered as the page's <h1> - give it the brand plus what/where.
  brandMark?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  children?: React.ReactNode;
  // Shown beside the copy on desktop (lg+), below it on smaller screens.
  aside?: React.ReactNode;
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
  aside,
  className,
}: HeroProps) {
  const { t } = useTranslation();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [videoSources, setVideoSources] = React.useState<VideoSource[] | null>(null);
  const [videoVisible, setVideoVisible] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const userPausedRef = React.useRef(false);
  userPausedRef.current = userPaused;

  // Picks the rendition for this screen only after the page has loaded.
  React.useEffect(() => {
    if (!videoSrc || !wantsHeroVideo()) return;
    return afterPageLoad(() => {
      const width = window.innerWidth < 768 ? HERO_VIDEO_WIDTH.small : HERO_VIDEO_WIDTH.large;
      setVideoSources([
        { src: cloudinaryVideoUrl(videoSrc, { width, extension: "webm" }), type: "video/webm" },
        { src: cloudinaryVideoUrl(videoSrc, { width, extension: "mp4" }), type: "video/mp4" },
      ]);
    });
  }, [videoSrc]);

  // Plays only while the hero is on screen (and the visitor hasn't paused it),
  // so a scrolled-away video costs no CPU or battery.
  React.useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!videoSources || !video || !section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !userPausedRef.current) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSources]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (userPaused) void video.play().catch(() => {});
    else video.pause();
    setUserPaused(!userPaused);
  };

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

  const hasCopy = Boolean(quote || subtitle || eyebrow || (ctaHref && ctaLabel) || children || aside);

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
        <img
          src={cloudinaryUrl(imageSrc, { width: 1920 })}
          srcSet={cloudinarySrcSet(imageSrc, HERO_IMAGE_WIDTHS)}
          sizes="100vw"
          alt={imageAlt}
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          crossOrigin="anonymous"
        />
        {videoSources ? (
          <video
            ref={videoRef}
            aria-hidden
            tabIndex={-1}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            disablePictureInPicture
            onPlaying={() => setVideoVisible(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
              videoVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {videoSources.map((source) => (
              <source key={source.type} src={source.src} type={source.type} />
            ))}
          </video>
        ) : null}
        {hasCopy ? (
          // Darken in from the left, where the copy sits. Below md the quote spans
          // nearly the full width, so the right side needs darkening there too.
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 md:from-black/80 md:via-black/45 md:to-transparent" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/10 to-transparent" />
      </div>

      {/* WCAG 2.2.2: moving content that plays on its own needs a way to stop it. */}
      {videoVisible ? (
        <button
          type="button"
          onClick={toggleVideo}
          aria-label={userPaused ? t("common.heroVideo.play") : t("common.heroVideo.pause")}
          aria-pressed={userPaused}
          className="absolute bottom-5 right-5 z-20 inline-flex size-10 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/60 text-brand-gold-light backdrop-blur-sm transition-colors hover:border-brand-gold hover:bg-brand-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 sm:bottom-6 sm:right-6"
        >
          {userPaused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
        </button>
      ) : null}

      {hasCopy ? (
        <div className="relative z-10 flex w-full flex-col gap-5 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-16">
          <div className="flex max-w-xl flex-col items-start gap-5 text-left">
            {eyebrow ? (
              <p className="text-xs uppercase tracking-[0.32em] text-brand-gold-light/90">
                {eyebrow}
              </p>
            ) : null}
            {/* The quote is the big visual line, but the brand line under it is
                the page's <h1>: that's what tells search engines what the page
                is ("Alphadent - dental clinic, Sopron"), which a motto can't. */}
            {quote ? (
              <blockquote
                style={{ fontFamily: '"Geist Variable", Georgia, "Times New Roman", serif' }}
                className="text-2xl italic font-light leading-snug text-brand-gold-light [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] md:text-4xl"
              >
                <p>{quote}</p>
              </blockquote>
            ) : null}
            {brandMark ? (
              <h1 className="text-sm font-semibold uppercase leading-relaxed tracking-[0.32em] text-brand-gold [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
                {brandMark}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="max-w-2xl text-sm text-brand-gold-muted md:text-base">{subtitle}</p>
            ) : null}
            {ctaHref && ctaLabel ? (
              <CtaButton href={ctaHref} title={ctaLabel} variant="ghost" className="mt-1" />
            ) : null}
            {children}
          </div>
          {aside ? <div className="w-full max-w-sm lg:shrink-0">{aside}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
