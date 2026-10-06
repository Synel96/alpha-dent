import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from "lucide-react";
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
// The large widths are only fetched once the visitor zooms in (see `sizes`).
const LIGHTBOX_IMAGE_WIDTHS = [960, 1280, 1600, 2048, 2560, 3200] as const;
const SWIPE_THRESHOLD = 50;

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const BUTTON_ZOOM_STEP = 1.5;
const DOUBLE_TAP_ZOOM = 2.5;
const DOUBLE_TAP_MS = 300;

type ZoomView = { scale: number; x: number; y: number };
const FIT: ZoomView = { scale: 1, x: 0, y: 0 };

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

// Zoom and pan for the lightbox photo: buttons, mouse wheel / trackpad pinch,
// double-click or double-tap, two-finger pinch, and dragging to pan while
// zoomed. The image is transformed (translate + scale around its centre),
// so its layout box - and everything around it - never moves.
function useZoomPan(imageKey: string) {
  const [view, setView] = React.useState<ZoomView>(FIT);
  const [gesturing, setGesturing] = React.useState(false);
  const viewRef = React.useRef(view);
  viewRef.current = view;
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  // State, not a ref: the surface only mounts a render after the dialog
  // opens (Radix portals in on a later commit), and the wheel listener
  // below has to be attached once it actually exists.
  const [surface, setSurface] = React.useState<HTMLElement | null>(null);
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const gesture = React.useRef<
    | { kind: "pan"; startX: number; startY: number; from: ZoomView }
    | { kind: "pinch"; startDistance: number; from: ZoomView; mid: { x: number; y: number } }
    | null
  >(null);
  // True once this interaction zoomed or panned, so the lightbox doesn't
  // also read it as a paging swipe or a backdrop click.
  const interactedRef = React.useRef(false);
  const lastTapRef = React.useRef<{ time: number; x: number; y: number } | null>(null);
  const lastTouchRef = React.useRef(0);

  // Back to "fit" for every new photo (and on reopening).
  React.useEffect(() => {
    setView(FIT);
  }, [imageKey]);

  // Keeps the photo from being dragged out of its frame: each edge can
  // travel at most to where the unzoomed photo's edge was.
  const clamp = React.useCallback((next: ZoomView): ZoomView => {
    const img = imageRef.current;
    const scale = clampScale(next.scale);
    if (scale === 1) return FIT;
    const maxX = img ? (img.offsetWidth * scale - img.offsetWidth) / 2 : 0;
    const maxY = img ? (img.offsetHeight * scale - img.offsetHeight) / 2 : 0;
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }, []);

  // Zooms so the image point under (clientX, clientY) stays put.
  const zoomAt = React.useCallback(
    (targetScale: number, clientX?: number, clientY?: number) => {
      const current = viewRef.current;
      const scale = clampScale(targetScale);
      // The surface wrapping the image isn't transformed, so its box is the
      // photo's unzoomed position; the point is taken relative to its centre.
      const box = imageRef.current?.parentElement?.getBoundingClientRect();
      const px = box && clientX !== undefined ? clientX - (box.left + box.width / 2) : 0;
      const py = box && clientY !== undefined ? clientY - (box.top + box.height / 2) : 0;
      const ratio = scale / current.scale;
      setView(clamp({ scale, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio }));
    },
    [clamp]
  );

  const zoomIn = () => zoomAt(viewRef.current.scale * BUTTON_ZOOM_STEP);
  const zoomOut = () => zoomAt(viewRef.current.scale / BUTTON_ZOOM_STEP);
  const reset = () => setView(FIT);

  const toggleAt = (clientX: number, clientY: number) => {
    if (viewRef.current.scale > 1) reset();
    else zoomAt(DOUBLE_TAP_ZOOM, clientX, clientY);
  };

  // Wheel / trackpad pinch (ctrl+wheel). Attached natively and non-passive:
  // preventDefault is needed so a trackpad pinch zooms the photo rather
  // than the whole page.
  React.useEffect(() => {
    const area = surface;
    if (!area) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002));
      zoomAt(viewRef.current.scale * factor, event.clientX, event.clientY);
    };
    area.addEventListener("wheel", onWheel, { passive: false });
    return () => area.removeEventListener("wheel", onWheel);
  }, [surface, zoomAt]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (pointers.current.size === 0) interactedRef.current = false;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const points = [...pointers.current.values()];
    if (points.length === 2) {
      const [a, b] = points;
      gesture.current = {
        kind: "pinch",
        startDistance: Math.hypot(a.x - b.x, a.y - b.y),
        from: viewRef.current,
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      interactedRef.current = true;
      setGesturing(true);
    } else if (points.length === 1 && viewRef.current.scale > 1) {
      gesture.current = { kind: "pan", startX: event.clientX, startY: event.clientY, from: viewRef.current };
      interactedRef.current = true;
      setGesturing(true);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const active = gesture.current;
    if (!active) return;
    if (active.kind === "pan") {
      setView(
        clamp({
          scale: active.from.scale,
          x: active.from.x + event.clientX - active.startX,
          y: active.from.y + event.clientY - active.startY,
        })
      );
    } else {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      viewRef.current = active.from;
      zoomAt(active.from.scale * (distance / active.startDistance), active.mid.x, active.mid.y);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    if (event.pointerType === "touch") {
      lastTouchRef.current = Date.now();
      // Double-tap (touch browsers don't reliably send dblclick).
      const last = lastTapRef.current;
      const now = Date.now();
      if (!interactedRef.current && last && now - last.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 30) {
        lastTapRef.current = null;
        interactedRef.current = true;
        toggleAt(event.clientX, event.clientY);
      } else {
        lastTapRef.current = { time: now, x: event.clientX, y: event.clientY };
      }
    }
    if (pointers.current.size === 0) {
      gesture.current = null;
      setGesturing(false);
    } else if (gesture.current?.kind === "pinch") {
      // One finger lifted: continue as a pan with the remaining one.
      const [remaining] = [...pointers.current.values()];
      gesture.current =
        viewRef.current.scale > 1
          ? { kind: "pan", startX: remaining.x, startY: remaining.y, from: viewRef.current }
          : null;
    }
  };

  const onDoubleClick = (event: React.MouseEvent) => {
    // Touch double-taps are handled in onPointerUp; ignore the synthetic dblclick some browsers add.
    if (Date.now() - lastTouchRef.current < 800) return;
    interactedRef.current = true;
    toggleAt(event.clientX, event.clientY);
  };

  return {
    view,
    gesturing,
    imageRef,
    interactedRef,
    zoomIn,
    zoomOut,
    reset,
    handlers: { ref: setSurface, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onDoubleClick },
  };
}

const ZOOM_BUTTON_CLASS =
  "inline-flex size-9 items-center justify-center rounded-full text-brand-gold-light transition hover:bg-brand-gold/15 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent";

const NAV_BUTTON_CLASS =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/75 text-brand-gold-light shadow-lg backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

// Full-screen image viewer on a Radix modal Dialog (focus trap, Esc to
// close, scroll lock, focus handed back to the opening thumbnail). Arrow keys,
// the side buttons or a horizontal swipe page through the images; a click
// on the dark backdrop closes it. The photo can be zoomed (toolbar, +/-/0
// keys, wheel, double-click/tap, pinch) and panned while zoomed - only here,
// never on the page itself.
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
  const zoom = useZoomPan(open ? imageKey : "");
  const zoomed = zoom.view.scale > 1;

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
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoom.zoomIn();
    } else if (event.key === "-") {
      event.preventDefault();
      zoom.zoomOut();
    } else if (event.key === "0") {
      event.preventDefault();
      zoom.reset();
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    // A new interaction outside the photo starts with a clean slate.
    if (!(event.target as Element).closest("[data-zoom-surface]")) zoom.interactedRef.current = false;
    swipeRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    swipedRef.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const swipe = swipeRef.current;
    swipeRef.current = null;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    // While zoomed (or after a pinch/pan), a drag moves the photo instead.
    if (zoomed || zoom.interactedRef.current) {
      swipedRef.current = true;
      return;
    }
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
          className="fixed inset-0 z-[61] flex flex-col items-center justify-center gap-4 overflow-hidden px-4 pb-6 pt-16 outline-none [touch-action:pan-y_pinch-zoom] sm:px-20"
        >
          <DialogPrimitive.Title className="sr-only">{current?.alt}</DialogPrimitive.Title>

          {images.length > 1 && index !== null ? (
            <p className="absolute left-4 top-5 z-10 text-xs uppercase tracking-[0.22em] text-brand-gold-muted sm:left-6">
              {index + 1} / {images.length}
            </p>
          ) : null}

          {current ? (
            <div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-black/75 p-1 backdrop-blur-sm">
              <button
                type="button"
                aria-label={t("common.lightbox.zoomOut")}
                onClick={zoom.zoomOut}
                disabled={!zoomed}
                className={cn(ZOOM_BUTTON_CLASS)}
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                aria-label={t("common.lightbox.resetZoom")}
                onClick={zoom.reset}
                disabled={!zoomed}
                className="min-w-[3.75rem] rounded-full px-2 py-1 text-center text-xs tabular-nums text-brand-gold-light transition hover:text-brand-gold disabled:cursor-default disabled:hover:text-brand-gold-light"
              >
                {Math.round(zoom.view.scale * 100)}%
              </button>
              <button
                type="button"
                aria-label={t("common.lightbox.zoomIn")}
                onClick={zoom.zoomIn}
                disabled={zoom.view.scale >= MAX_SCALE}
                className={cn(ZOOM_BUTTON_CLASS)}
              >
                <Plus className="size-4" />
              </button>
            </div>
          ) : null}

          <DialogPrimitive.Close asChild>
            <button
              type="button"
              aria-label={t("common.lightbox.close")}
              className={cn(NAV_BUTTON_CLASS, "absolute right-4 top-3 z-10 sm:right-6")}
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
              {/* The zoom/pan surface: touch-action none so pinches and
                  drags reach our handlers instead of zooming the page. */}
              <div
                data-zoom-surface
                {...zoom.handlers}
                className={cn(
                  "flex min-h-0 justify-center [touch-action:none]",
                  zoomed ? (zoom.gesturing ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
                )}
              >
              <img
                ref={zoom.imageRef}
                key={imageKey}
                src={useOriginal ? current.src : cloudinaryUrl(current.src, { width: 1600, crop: "limit" })}
                srcSet={useOriginal ? undefined : cloudinarySrcSet(current.src, LIGHTBOX_IMAGE_WIDTHS, { crop: "limit" })}
                // Asking for a wider rendition while zoomed makes the browser
                // fetch a sharper candidate from srcSet (it keeps showing the
                // current one until that has loaded).
                sizes={`${Math.round(Math.min(zoom.view.scale, 3) * 100)}vw`}
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
                style={{
                  transform: `translate(${zoom.view.x}px, ${zoom.view.y}px) scale(${zoom.view.scale})`,
                }}
                className={cn(
                  "lightbox-animate max-h-[calc(100dvh-10rem)] min-h-0 w-auto max-w-full select-none rounded-2xl border border-brand-gold/30 object-contain shadow-[0_24px_64px_-24px_rgba(201,168,76,0.45)] will-change-transform",
                  // Smooth for button/double-click zoom, immediate while a
                  // finger or the mouse is moving it.
                  !zoom.gesturing && "transition-transform duration-200 ease-out motion-reduce:transition-none",
                  loaded ? "[animation:lightbox-zoom_260ms_ease-out]" : "opacity-0"
                )}
              />
              </div>
              <figcaption
                className={cn(
                  "max-w-2xl text-center text-sm leading-relaxed text-white/85 transition-opacity",
                  zoomed && "opacity-0"
                )}
              >
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
                className={cn(NAV_BUTTON_CLASS, "absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label={t("common.lightbox.next")}
                onClick={() => step(1)}
                className={cn(NAV_BUTTON_CLASS, "absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-6")}
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
