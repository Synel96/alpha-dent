import React from "react";
import { Pause, Play, type LucideIcon } from "lucide-react";
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
const HERO_VIDEO_WIDTHS = [1280, 1920] as const;

// Portrait phones (matches Tailwind's `max-md:portrait:`). Covering the whole
// full-height hero there zooms the landscape clip in to its middle quarter -
// too close to make out what happens in it. So there the sharp video only
// covers the middle FIT_HEIGHT of the hero (keep the two in sync), which
// shows ~1.7x as much of its width, and fades out at the top and bottom into
// a blurred, enlarged copy of it that fills the rest: the hero is still all
// moving video, the copy on top of it as before.
const FIT_QUERY = "(max-width: 767px) and (orientation: portrait)";
// Below Tailwind's md breakpoint (matches `max-md:`).
const PHONE_QUERY = "(max-width: 767px)";
const FIT_HEIGHT = 0.6;
const FIT_BAND_CLASS =
  "max-md:portrait:inset-auto max-md:portrait:inset-x-0 max-md:portrait:top-1/2 max-md:portrait:h-[60%] max-md:portrait:-translate-y-1/2 max-md:portrait:[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]";
const FIT_FILL_CLASS = "h-full w-full scale-110 object-cover blur-2xl brightness-75";

// The video covers the full-height hero (on portrait phones FIT_HEIGHT of
// it), so it is scaled by that height as well as the screen width. Pick the
// smallest rendition that covers that in device pixels (assuming a 16:9
// clip), so no one is sent a low-resolution one that then looks pixelated
// once stretched.
function heroVideoWidth(): number {
  const coveredHeight = ((window.matchMedia(FIT_QUERY).matches ? FIT_HEIGHT : 1) * window.innerHeight * 16) / 9;
  const needed = Math.max(window.innerWidth, coveredHeight) * (window.devicePixelRatio || 1);
  return HERO_VIDEO_WIDTHS.find((width) => width >= needed) ?? HERO_VIDEO_WIDTHS[HERO_VIDEO_WIDTHS.length - 1];
}

// WebM (VP9) is smaller, but only where the device decodes it in hardware.
// iPhones and iPads report they can play VP9, yet many decode it in software,
// which can't keep up with this clip: it froze a moment after it started, on
// each device at a different frame. H.264 (MP4) is hardware-decoded
// everywhere, so anything not known to be smooth and power-efficient gets that.
async function heroVideoExtension(width: number): Promise<"webm" | "mp4"> {
  if (!document.createElement("video").canPlayType('video/webm; codecs="vp9"')) return "mp4";
  const capabilities = navigator.mediaCapabilities;
  if (!capabilities?.decodingInfo) return "webm";
  try {
    const info = await capabilities.decodingInfo({
      type: "file",
      video: {
        contentType: 'video/webm; codecs="vp09.00.40.08"',
        width,
        height: Math.round((width * 9) / 16),
        bitrate: 1_000_000,
        framerate: 30,
      },
    });
    return info.supported && info.smooth && info.powerEfficient ? "webm" : "mp4";
  } catch {
    return "mp4";
  }
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
  // A short trust line under the quote (e.g. "since 1996"), with an
  // optional icon before it.
  tagline?: string;
  taglineIcon?: LucideIcon;
  // Rendered as the page's <h1> - give it the brand plus what/where.
  brandMark?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  onCtaClick?: React.MouseEventHandler<HTMLAnchorElement>;
  // Shown beside the CTA button, e.g. a call link.
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  // Shown beside the copy on desktop (lg+), below it on tablets, and on
  // phones right under the hero - not over the video, where it would cover
  // its lower third and make the hero taller than the screen. Rendered once
  // either way (see `asideBelow`).
  aside?: React.ReactNode;
  className?: string;
};

export function Hero({
  imageSrc,
  imageAlt = "",
  videoSrc,
  eyebrow,
  quote,
  tagline,
  taglineIcon: TaglineIcon,
  brandMark,
  subtitle,
  ctaHref,
  ctaLabel,
  onCtaClick,
  secondaryAction,
  children,
  aside,
  className,
}: HeroProps) {
  const { t } = useTranslation();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const fillVideoRef = React.useRef<HTMLVideoElement | null>(null);
  // Whether the blurred fill is showing (FIT_QUERY): only then is its second
  // <video> mounted, so other screens don't decode the clip twice.
  const [fitMode, setFitMode] = React.useState(false);
  // Phones show the aside under the hero instead of in it. Only one copy is
  // ever in the page - not one per layout with the other hidden, which
  // reads as duplicate text to search engines and SEO checkers: the
  // prerendered HTML has the in-hero one (CSS hides it on phones), and on a
  // phone it moves under the hero once the script runs. That spot is below
  // the fold, so the move shifts nothing on screen.
  const [asideBelow, setAsideBelow] = React.useState(false);
  // An object URL of the fully downloaded video - see the effect below.
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoVisible, setVideoVisible] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const userPausedRef = React.useRef(false);
  userPausedRef.current = userPaused;
  const inViewRef = React.useRef(true);

  // Starts downloading the whole video as soon as the page itself has loaded
  // (no lazy loading - it doesn't wait for a scroll), and only hands it to the
  // <video> once it is all there - so it never starts early and stutters on a
  // slow connection (or while Cloudinary is still transcoding a first request).
  // Waiting for the load event keeps the multi-megabyte download from
  // competing with the hero photo (the LCP) and the page's own files for
  // bandwidth. Fetched anonymously: no cookies or other credentials are sent.
  // Until then the still photo stays.
  React.useEffect(() => {
    if (!videoSrc || !wantsHeroVideo()) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    const start = () => {
      const width = heroVideoWidth();
      heroVideoExtension(width)
        .then((extension) =>
          fetch(cloudinaryVideoUrl(videoSrc, { width, extension }), {
            credentials: "omit",
            mode: "cors",
            referrerPolicy: "no-referrer",
            signal: controller.signal,
          })
        )
        .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
        })
        // No video (offline, blocked, aborted): the still photo simply stays.
        .catch(() => {});
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
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

  // The browser can pause the video on its own: a locked screen, a switch to
  // another app or tab, a battery saver (iOS especially). Nothing scrolls, so
  // the observer above never fires again and the hero would stay frozen on
  // that frame - wherever it happened to be on that device. So whenever the
  // page is shown again, play it again (unless the visitor paused it).
  React.useEffect(() => {
    if (!videoUrl) return;
    const resume = () => {
      if (document.visibilityState === "visible") playIfWanted();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, [videoUrl]);

  // A playing video whose time stops moving has stalled (a decoder hiccup, or
  // a damaged copy in the browser cache that ends early without "ended", so
  // the loop never restarts it). Every couple of seconds check that it moves;
  // if not, restart it from the beginning.
  React.useEffect(() => {
    if (!videoUrl) return;
    let lastTime = -1;
    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !inViewRef.current || document.visibilityState !== "visible") {
        lastTime = -1;
        return;
      }
      if (video.currentTime === lastTime) {
        video.currentTime = 0;
        void video.play().catch(() => {});
        lastTime = -1;
        return;
      }
      lastTime = video.currentTime;
    }, 2000);
    return () => window.clearInterval(timer);
  }, [videoUrl]);

  React.useEffect(() => {
    if (!aside) return;
    const query = window.matchMedia(PHONE_QUERY);
    const update = () => setAsideBelow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [aside]);

  React.useEffect(() => {
    if (!videoSrc) return;
    const query = window.matchMedia(FIT_QUERY);
    const update = () => setFitMode(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [videoSrc]);

  // The blurred fill just mirrors the sharp video: it plays and pauses with
  // it (pause button, scrolled off screen), including when it mounts late,
  // e.g. after the phone is turned upright.
  const syncFill = () => {
    const video = videoRef.current;
    const fill = fillVideoRef.current;
    if (!video || !fill) return;
    if (video.paused) fill.pause();
    else void fill.play().catch(() => {});
  };
  React.useEffect(syncFill, [fitMode, videoUrl]);

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

  const hasCopy = Boolean(quote || tagline || subtitle || eyebrow || (ctaHref && ctaLabel) || children || aside);

  return (
    <>
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
          {videoSrc ? (
            // Same srcset and sizes as the sharp photo below, so the browser
            // reuses that one download.
            <div aria-hidden className="absolute inset-0 hidden overflow-hidden max-md:portrait:block">
              <img
                src={cloudinaryUrl(imageSrc, { width: 1920 })}
                srcSet={cloudinarySrcSet(imageSrc, HERO_IMAGE_WIDTHS)}
                sizes="100vw"
                alt=""
                className={FIT_FILL_CLASS}
                loading="eager"
                decoding="async"
                crossOrigin="anonymous"
              />
              {videoUrl && fitMode ? (
                <video
                  ref={fillVideoRef}
                  src={videoUrl}
                  tabIndex={-1}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500 ease-out",
                    FIT_FILL_CLASS,
                    videoVisible ? "opacity-100" : "opacity-0"
                  )}
                />
              ) : null}
            </div>
          ) : null}
          <div className={cn("absolute inset-0", videoSrc && FIT_BAND_CLASS)}>
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
                onPlay={syncFill}
                onPause={syncFill}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
                  videoVisible ? "opacity-100" : "opacity-0"
                )}
              />
            ) : null}
          </div>
          {hasCopy ? (
            // Darken in from the left, where the copy sits, strongly enough that the
            // gold quote stays readable over any video frame. The right side keeps a
            // lighter tint so the clip still shows through behind the status card.
            <div className="absolute inset-0 bg-gradient-to-r from-black/[0.78] via-black/55 via-45% to-black/25" />
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
              {tagline ? (
                <p className="-mt-1 inline-flex items-center gap-2 text-sm text-brand-gold-muted [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
                  {TaglineIcon ? <TaglineIcon aria-hidden className="size-4 shrink-0 text-brand-gold" /> : null}
                  {tagline}
                </p>
              ) : null}
              {brandMark ? (
                <h1 className="text-sm font-semibold uppercase leading-relaxed tracking-[0.32em] text-brand-gold [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
                  {brandMark}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="max-w-2xl text-sm text-brand-gold-muted md:text-base">{subtitle}</p>
              ) : null}
              {(ctaHref && ctaLabel) || secondaryAction ? (
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {ctaHref && ctaLabel ? <CtaButton href={ctaHref} title={ctaLabel} variant="ghost" onClick={onCtaClick} /> : null}
                  {secondaryAction}
                </div>
              ) : null}
              {children}
            </div>
            {aside && !asideBelow ? <div className="w-full max-w-sm max-md:hidden lg:shrink-0">{aside}</div> : null}
          </div>
        ) : null}
      </section>
      {aside && asideBelow ? <div className="bg-brand-black px-6 pb-2 sm:px-10 md:hidden">{aside}</div> : null}
    </>
  );
}
