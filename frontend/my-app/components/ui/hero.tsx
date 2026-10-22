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

// WebM (VP9) is smaller; MP4 (H.264) for browsers without it, e.g. older Safari.
function heroVideoExtension(): "webm" | "mp4" {
  return document.createElement("video").canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
}

// Whether to fetch the background video at all: never for visitors who ask
// for less motion or less data - they keep the still photo.
function wantsHeroVideo(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData;
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
  // An object URL of the fully downloaded video - see the effect below.
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoVisible, setVideoVisible] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const userPausedRef = React.useRef(false);
  userPausedRef.current = userPaused;
  const inViewRef = React.useRef(true);

  // Starts downloading the whole video straight away (no lazy loading), and
  // only hands it to the <video> once it is all there - so it never starts
  // early and stutters on a slow connection (or while Cloudinary is still
  // transcoding a first request). Fetched anonymously: no cookies or other
  // credentials are sent. Until then the still photo stays.
  React.useEffect(() => {
    if (!videoSrc || !wantsHeroVideo()) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    const width = window.innerWidth < 768 ? HERO_VIDEO_WIDTH.small : HERO_VIDEO_WIDTH.large;
    fetch(cloudinaryVideoUrl(videoSrc, { width, extension: heroVideoExtension() }), {
      credentials: "omit",
      mode: "cors",
      referrerPolicy: "no-referrer",
      priority: "high",
      signal: controller.signal,
    } as RequestInit & { priority?: "high" | "low" | "auto" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setVideoUrl(objectUrl);
      })
      // No video (offline, blocked, aborted): the still photo simply stays.
      .catch(() => {});
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc]);

  const playIfWanted = () => {
    const video = videoRef.current;
    if (video && inViewRef.current && !userPausedRef.current) void video.play().catch(() => {});
  };

  // Plays only while the hero is on screen (and the visitor hasn't paused it),
  // so a scrolled-away video costs no CPU or battery.
  React.useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!videoUrl || !video || !section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = Boolean(entry?.isIntersecting);
      if (inViewRef.current) playIfWanted();
      else video.pause();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [videoUrl]);

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
      // The padding keeps the copy clear of that header: on a phone turned
      // sideways the copy is taller than the screen, so instead of being
      // centred it starts at the top - and would slide under the navbar.
      style={{
        marginTop: "calc(-1 * var(--nav-height, 72px))",
        paddingTop: "calc(var(--nav-height, 72px) + 1.5rem)",
        paddingBottom: "2.5rem",
      }}
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
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            aria-hidden
            tabIndex={-1}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            // Already fully downloaded; start once it is decoded and ready.
            onCanPlayThrough={playIfWanted}
            onPlaying={() => setVideoVisible(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
              videoVisible ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null}
        {hasCopy ? (
          // Darken in from the left, where the copy sits. Below md the quote spans
          // nearly the full width, so the right side needs darkening there too.
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10 md:from-black/55 md:via-black/20 md:to-transparent" />
        ) : null}
        {/* Only the bottom third fades into the page background, so the video
            stays bright and the hero still flows into the next section. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-black to-transparent" />
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
