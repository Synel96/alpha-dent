import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export type LightboxImage = { src: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  // Index of the open image, or null while closed.
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

// c_limit, not the default c_fill: the whole photo, never cropped or upscaled.
const LIGHTBOX_IMAGE_WIDTHS = [960, 1280, 1600, 2048] as const;
const SWIPE_THRESHOLD = 50;

const NAV_BUTTON_CLASS =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/75 text-brand-gold-light shadow-lg backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

// Full-screen image viewer on a Radix modal Dialog (focus trap, Esc to
// close, scroll lock, focus handed back to the opening thumbnail). Arrow keys,
// the side buttons or a horizontal swipe page through the images; a click
// on the dark backdrop closes it.
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const { t } = useTranslation();
  const open = index !== null && images.length > 0;
  const current = open ? images[index] : undefined;
  // Keyed by image (not reset in an effect), so a cached image whose load
  // event fires right away can never be flagged "loading" again afterwards.
  const [loadedKey, setLoadedKey] = React.useState<string | null>(null);
  // If the resized Cloudinary variant fails, retry once with the original
  // upload before giving up (the caption is shown either way).
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const useOriginal = current !== undefined && failedSrc === current.src;
  const imageKey = current ? `${current.src}${useOriginal ? "#original" : ""}` : "";
  const loaded = loadedKey === imageKey;
  const swipeRef = React.useRef<{ pointerId: number; startX: number; startY: number } | null>(null);
  const swipedRef = React.useRef(false);
  // There is no Radix <Trigger> (galleries open it from many thumbnails),
  // so remember what had focus and hand it back on close ourselves.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  const step = (direction: 1 | -1) => {
    if (index === null || images.length < 2) return;
    onIndexChange((index + direction + images.length) % images.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    swipeRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    swipedRef.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const swipe = swipeRef.current;
    swipeRef.current = null;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const dx = event.clientX - swipe.startX;
    const dy = event.clientY - swipe.startY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swipedRef.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };

  // Only a plain click on the backdrop itself closes - not one that ends a
  // swipe, and not one on the photo or the buttons.
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="lightbox-animate fixed inset-0 z-[60] bg-black/90 backdrop-blur-md [animation:lightbox-fade_200ms_ease-out]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocusRef.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current;
            if (target?.isConnected) {
              event.preventDefault();
              target.focus({ preventScroll: true });
            }
          }}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (swipeRef.current = null)}
          onClick={handleBackdropClick}
          // pan-y + pinch-zoom: horizontal finger moves reach the swipe
          // handlers instead of being claimed by the browser, pinch still works.
          className="fixed inset-0 z-[61] flex flex-col items-center justify-center gap-4 px-4 pb-6 pt-16 outline-none [touch-action:pan-y_pinch-zoom] sm:px-20"
        >
          <DialogPrimitive.Title className="sr-only">{current?.alt}</DialogPrimitive.Title>

          {images.length > 1 && index !== null ? (
            <p className="absolute left-4 top-5 text-xs uppercase tracking-[0.22em] text-brand-gold-muted sm:left-6">
              {index + 1} / {images.length}
            </p>
          ) : null}

          <DialogPrimitive.Close asChild>
            <button
              type="button"
              aria-label={t("common.lightbox.close")}
              className={cn(NAV_BUTTON_CLASS, "absolute right-4 top-3 sm:right-6")}
            >
              <X className="size-5" />
            </button>
          </DialogPrimitive.Close>

          {current && !loaded ? (
            <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="size-10 animate-spin rounded-full border-2 border-brand-gold/25 border-t-brand-gold-light" />
            </span>
          ) : null}

          {current ? (
            <figure className="flex max-h-full min-h-0 flex-col items-center gap-3">
              <img
                key={imageKey}
                src={useOriginal ? current.src : cloudinaryUrl(current.src, { width: 1600, crop: "limit" })}
                srcSet={useOriginal ? undefined : cloudinarySrcSet(current.src, LIGHTBOX_IMAGE_WIDTHS, { crop: "limit" })}
                sizes="100vw"
                alt={current.alt}
                // Eager on purpose: this <img> only exists once the visitor
                // opens the photo, so it is already loaded on demand - and a
                // still-invisible, zero-size lazy image may never start.
                loading="eager"
                decoding="async"
                crossOrigin="anonymous"
                draggable={false}
                onLoad={() => setLoadedKey(imageKey)}
                onError={() => (useOriginal ? setLoadedKey(imageKey) : setFailedSrc(current.src))}
                className={cn(
                  "lightbox-animate max-h-[calc(100dvh-10rem)] min-h-0 w-auto max-w-full select-none rounded-2xl border border-brand-gold/30 object-contain shadow-[0_24px_64px_-24px_rgba(201,168,76,0.45)]",
                  loaded ? "[animation:lightbox-zoom_260ms_ease-out]" : "opacity-0"
                )}
              />
              <figcaption className="max-w-2xl text-center text-sm leading-relaxed text-white/85">
                {current.alt}
              </figcaption>
            </figure>
          ) : null}

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label={t("common.lightbox.prev")}
                onClick={() => step(-1)}
                className={cn(NAV_BUTTON_CLASS, "absolute left-3 top-1/2 -translate-y-1/2 sm:left-6")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label={t("common.lightbox.next")}
                onClick={() => step(1)}
                className={cn(NAV_BUTTON_CLASS, "absolute right-3 top-1/2 -translate-y-1/2 sm:right-6")}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Small gold "zoom" mark in a photo's corner, so it reads as openable on
// touch screens too, where there is no hover state to hint at it.
export function ZoomBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/70 text-brand-gold-light opacity-80 backdrop-blur-sm transition group-hover:opacity-100",
        className
      )}
    >
      <ZoomIn className="size-4" />
    </span>
  );
}

type ZoomableImageProps = {
  image: LightboxImage;
  className?: string;
  children: React.ReactNode;
};

// Wraps a single photo (children) in a button that opens it in the Lightbox.
export function ZoomableImage({ image, className, children }: ZoomableImageProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t("common.lightbox.open", { alt: image.alt })}
        onClick={() => setOpen(true)}
        className={cn(
          "group relative block w-full cursor-zoom-in rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70",
          className
        )}
      >
        {children}
        <ZoomBadge />
      </button>
      <Lightbox images={[image]} index={open ? 0 : null} onIndexChange={() => {}} onClose={() => setOpen(false)} />
    </>
  );
}
