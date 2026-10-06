import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { ImageSkeleton, useImageLoaded } from "./image-skeleton";
import { Lightbox, ZoomBadge } from "./lightbox";

const GALLERY_IMAGE_WIDTHS = [400, 640, 960] as const;
// Per image, so the strip moves at the same speed whatever the image count.
const SECONDS_PER_IMAGE = 8;
// How long the auto-scroll waits after the last swipe, drag, wheel or arrow
// click before it picks up again from wherever the user left the strip.
const RESUME_DELAY_MS = 2500;
const GAP_PX = 16;
// One loop unit (the stretch the strip scrolls before it repeats) must be
// wider than the viewport, or the end of the loop shows empty space. A short
// list is repeated until it has at least this many tiles: 8 x 400px covers
// a 2560px-wide screen.
const MIN_LOOP_ITEMS = 8;

type GalleryImage = {
  src: string;
  alt: string;
};

type AutoGalleryProps = {
  images: GalleryImage[];
  className?: string;
};

const ARROW_CLASS =
  "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/85 text-brand-gold-light shadow-lg transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

// Horizontal, auto-scrolling strip of photos that the visitor can also move
// by hand: native swipe on touch, click-and-drag with a mouse, the wheel /
// trackpad, or the prev/next arrows. Any of those pauses the auto-scroll,
// which resumes a moment later from the new position. Clicking a photo opens
// it in the Lightbox.
//
// The auto-scroll drives the container's real scrollLeft (not a CSS
// transform), so manual scrolling and the animation share one position. Its
// frame loop only runs while the strip is on screen (IntersectionObserver),
// so an off-screen gallery costs nothing, and never under
// prefers-reduced-motion - the strip then simply stays manual.
export function AutoGallery({ images, className }: AutoGalleryProps) {
  const { t } = useTranslation();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const hoverRef = React.useRef(false);
  const touchRef = React.useRef(false);
  const idleUntilRef = React.useRef(0);
  const dragRef = React.useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(
    null
  );
  const draggedRef = React.useRef(false);
  const lightboxOpenRef = React.useRef(false);
  lightboxOpenRef.current = lightboxIndex !== null;

  // The image list, repeated as often as needed to make one loop unit.
  const unitLength = images.length * Math.max(1, Math.ceil(MIN_LOOP_ITEMS / Math.max(images.length, 1)));

  const pauseForAWhile = () => {
    idleUntilRef.current = performance.now() + RESUME_DELAY_MS;
  };

  // Width of one loop unit (the track holds two back to back):
  // scrolling by exactly this much lands on an identical frame, which is
  // what makes the loop seamless in both directions. Measured only when the
  // track resizes (ResizeObserver), never per frame, so the frame loop and
  // scroll handler don't force a layout on every tick.
  const loopWidthRef = React.useRef(0);
  const loopWidth = () => loopWidthRef.current;

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const firstCopy = track.children[0] as HTMLElement | undefined;
      const secondCopy = track.children[unitLength] as HTMLElement | undefined;
      loopWidthRef.current = firstCopy && secondCopy ? secondCopy.offsetLeft - firstCopy.offsetLeft : 0;
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [unitLength]);

  // Kept observing (not disconnected after the first hit) so the frame loop
  // can stop again whenever the strip scrolls out of view.
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const node = scrollRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    const node = scrollRef.current;
    if (!node) return;

    // Fractional position kept here, since browsers may round scrollLeft.
    let position = node.scrollLeft;
    let last = performance.now();
    let wasPaused = false;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 100);
      last = now;
      const width = loopWidthRef.current;
      const paused =
        hoverRef.current ||
        touchRef.current ||
        dragRef.current !== null ||
        lightboxOpenRef.current ||
        now < idleUntilRef.current ||
        width <= 0;

      if (paused) {
        wasPaused = true;
      } else {
        // Pick up from wherever the visitor left the strip.
        if (wasPaused) {
          position = node.scrollLeft;
          wasPaused = false;
        }
        const speed = width / (unitLength * SECONDS_PER_IMAGE * 1000);
        position += speed * elapsed;
        if (position >= width) position -= width;
        node.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, unitLength]);

  // Manual scrolling past either end jumps by one copy's width, so swiping
  // or dragging never hits a wall either way.
  const handleScroll = () => {
    const node = scrollRef.current;
    const width = loopWidth();
    if (!node || width <= 0) return;
    if (node.scrollLeft >= width) {
      node.scrollLeft -= width;
      if (dragRef.current) dragRef.current.startScrollLeft -= width;
    } else if (node.scrollLeft <= 0 && (touchRef.current || dragRef.current || performance.now() < idleUntilRef.current)) {
      node.scrollLeft += width;
      if (dragRef.current) dragRef.current.startScrollLeft += width;
    }
  };

  const scrollByCard = (direction: 1 | -1) => {
    const node = scrollRef.current;
    if (!node) return;
    pauseForAWhile();
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    const amount = (card?.offsetWidth ?? node.clientWidth * 0.8) + GAP_PX;
    const width = loopWidth();
    // Wrap first, instantly, so the smooth scroll below never has to cross
    // a loop boundary (adjusting scrollLeft mid-animation would cancel it).
    if (width > 0) {
      if (direction === -1 && node.scrollLeft - amount < 0) node.scrollLeft += width;
      if (direction === 1 && node.scrollLeft + amount >= width) node.scrollLeft -= width;
    }
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  // Click-and-drag for mouse users: a plain overflow-x-auto strip with a
  // hidden scrollbar doesn't otherwise respond to a mouse drag. Touch keeps
  // the browser's native swipe (and momentum).
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggedRef.current = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const node = scrollRef.current;
    if (!node) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: node.scrollLeft };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (!draggedRef.current && Math.abs(delta) > 5) {
      draggedRef.current = true;
      // Captured only once it is really a drag, so a plain click still
      // lands on the photo button underneath.
      node.setPointerCapture(event.pointerId);
    }
    if (draggedRef.current) node.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setDragging(false);
    pauseForAWhile();
  };

  // Swallow the click that a drag release would otherwise turn into
  // "open this photo".
  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      draggedRef.current = false;
    }
  };

  // Two loop units back to back, so the strip can loop by jumping exactly
  // one unit's width. Only the first occurrence of each photo is exposed to
  // assistive tech and the tab order; the repeats are decorative.
  const track = Array.from({ length: unitLength * 2 }, (_, index) => images[index % images.length]);

  return (
    <div
      className={cn("relative", className)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = false;
      }}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onTouchStart={() => {
          touchRef.current = true;
        }}
        onTouchEnd={() => {
          touchRef.current = false;
          pauseForAWhile();
        }}
        onTouchCancel={() => {
          touchRef.current = false;
          pauseForAWhile();
        }}
        onWheel={pauseForAWhile}
        onFocus={pauseForAWhile}
        // touch-action stays auto (see ServiceCarousel): the browser picks
        // horizontal swipe vs. vertical page scroll per gesture.
        className={cn(
          "overflow-x-auto [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
          dragging && "select-none"
        )}
        style={{ scrollbarWidth: "none" }}
      >
        <div ref={trackRef} className="flex w-max gap-4">
          {track.map((image, index) => (
            <GalleryTile
              key={index}
              image={image}
              isCopy={index >= images.length}
              label={t("common.lightbox.open", { alt: image.alt })}
              onOpen={() => setLightboxIndex(index % images.length)}
            />
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={t("common.gallery.prev")}
            onClick={() => scrollByCard(-1)}
            className={cn(ARROW_CLASS, "left-2 sm:left-4")}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t("common.gallery.next")}
            onClick={() => scrollByCard(1)}
            className={cn(ARROW_CLASS, "right-2 sm:right-4")}
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      ) : null}

      <Lightbox
        images={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => {
          setLightboxIndex(null);
          pauseForAWhile();
        }}
      />
    </div>
  );
}

type GalleryTileProps = {
  image: GalleryImage;
  // The second, looping copy of the list: hidden from assistive tech and
  // the tab order so the photos aren't announced twice.
  isCopy: boolean;
  label: string;
  onOpen: () => void;
};

function GalleryTile({ image, isCopy, label, onOpen }: GalleryTileProps) {
  const { ref, loaded, onLoad, onError } = useImageLoaded();

  return (
    <button
      type="button"
      aria-hidden={isCopy || undefined}
      tabIndex={isCopy ? -1 : undefined}
      aria-label={isCopy ? undefined : label}
      onClick={onOpen}
      className="group relative h-56 w-72 shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border border-brand-border bg-brand-surface/60 shadow-[0_18px_36px_-24px_rgba(201,168,76,0.4)] transition-colors hover:border-brand-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 sm:h-64 sm:w-96"
    >
      <ImageSkeleton visible={!loaded} />
      <img
        ref={ref}
        src={cloudinaryUrl(image.src, { width: 640 })}
        srcSet={cloudinarySrcSet(image.src, GALLERY_IMAGE_WIDTHS)}
        sizes="(min-width: 640px) 384px, 288px"
        alt={isCopy ? "" : image.alt}
        width={384}
        height={256}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
        draggable={false}
        onLoad={onLoad}
        onError={onError}
        className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <ZoomBadge />
    </button>
  );
}
