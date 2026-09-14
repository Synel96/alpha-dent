import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type ServiceCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

// Horizontal, snap-based carousel. On touch devices the row scrolls (and
// snaps) natively via CSS, no JS needed. On pointer devices the prev/next
// buttons drive the same scroll container with scrollBy, since a bare
// horizontal overflow is easy to miss without a visible grid.
export function ServiceCarousel({ children, className }: ServiceCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(
    null
  );
  const draggedRef = React.useRef(false);
  const [dragging, setDragging] = React.useState(false);

  const scrollByCard = (direction: 1 | -1) => {
    const node = scrollRef.current;
    if (!node) return;
    const card = node.firstElementChild as HTMLElement | null;
    const gap = 16;
    const amount = (card?.offsetWidth ?? node.clientWidth * 0.8) + gap;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  // Click-and-drag scrolling for mouse users: the scrollbar is hidden for a
  // cleaner look, and a plain overflow-x-auto div doesn't respond to a
  // mouse drag on its own, so without this a mouse user has no way to pan
  // the strip except the arrow buttons.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = scrollRef.current;
    if (!node) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: node.scrollLeft };
    draggedRef.current = false;
    node.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) draggedRef.current = true;
    node.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;
    node.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setDragging(false);
  };

  // A card is a link; suppress the click that would otherwise fire (and
  // navigate) right after a drag release.
  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      draggedRef.current = false;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        // Deliberately touch-action: auto (the default) rather than
        // touch-pan-x: pan-x forces the browser to commit this touch
        // gesture to horizontal panning on THIS element up front, which
        // also blocks handing a mostly-vertical gesture that starts on a
        // card off to the page scroll - exactly the "feels stuck, looks
        // like the end of the page" complaint. The native ambiguity
        // resolution (auto) picks the right axis per-gesture instead, and
        // horizontal swipe still works fine now that scroll-behavior:
        // smooth (the thing that originally broke it) is gone.
        className={cn(
          "flex snap-x snap-proximity gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
          dragging && "select-none"
        )}
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label={t("common.carousel.prev")}
        onClick={() => scrollByCard(-1)}
        className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/85 p-2 text-brand-gold-light shadow-lg transition hover:border-brand-gold hover:text-brand-gold sm:flex"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label={t("common.carousel.next")}
        onClick={() => scrollByCard(1)}
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/85 p-2 text-brand-gold-light shadow-lg transition hover:border-brand-gold hover:text-brand-gold sm:flex"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
