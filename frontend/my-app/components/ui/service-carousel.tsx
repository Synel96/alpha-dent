import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type ServiceCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

// Horizontal, snap-based carousel. On touch devices the row scrolls (and
// snaps) natively via CSS. Since a bare horizontal overflow is easy to miss,
// it always shows that it can be paged: one dot per stop (the current one
// highlighted, each a button to jump there) and prev/next arrows - beside
// the row from sm up, next to the dots on phones. The arrows step one whole
// card and are disabled at either end.
const ARROW_CLASS =
  "inline-flex items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/85 p-2 text-brand-gold-light shadow-lg transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 disabled:pointer-events-none disabled:opacity-35";
// From sm up: vertically centred on the cards (the wrapper's height also
// holds the dots row below them, hence the offset).
const SIDE_ARROW_CLASS = "sm:absolute sm:top-[calc(50%-1.25rem)] sm:-translate-y-1/2";

export function ServiceCarousel({ children, className }: ServiceCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(
    null
  );
  const draggedRef = React.useRef(false);
  const [dragging, setDragging] = React.useState(false);
  const count = React.Children.count(children);
  // One dot per place the row can actually stop at: each card that can be
  // brought to the left edge, plus the end of the row. On a wide screen most
  // cards are visible at once, so there are fewer stops than cards.
  const [stops, setStops] = React.useState(count);
  const [active, setActive] = React.useState(0);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(count <= 1);

  const measure = React.useCallback(() => {
    const node = scrollRef.current;
    // Not laid out (yet), e.g. inside a hidden parent: nothing to measure,
    // so keep the default one-dot-per-card controls.
    if (!node || node.clientWidth === 0) return null;
    const starts = (Array.from(node.children) as HTMLElement[]).map((card) => card.offsetLeft - node.offsetLeft);
    const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
    const lefts = maxScroll > 2 ? [...starts.filter((start) => start < maxScroll - 2), maxScroll] : [0];
    return { node, lefts, maxScroll };
  }, []);

  const updatePosition = React.useCallback(() => {
    const measured = measure();
    if (!measured) return;
    const { node, lefts, maxScroll } = measured;
    const end = node.scrollLeft >= maxScroll - 2;
    let index = 0;
    lefts.forEach((left, i) => {
      if (Math.abs(left - node.scrollLeft) < Math.abs(lefts[index] - node.scrollLeft)) index = i;
    });
    setStops(lefts.length);
    setActive(end ? lefts.length - 1 : index);
    setAtStart(node.scrollLeft <= 2);
    setAtEnd(end);
  }, [measure]);

  React.useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  const goTo = (index: number) => {
    const measured = measure();
    if (!measured) return;
    const { node, lefts } = measured;
    node.scrollTo({ left: lefts[Math.max(0, Math.min(index, lefts.length - 1))], behavior: "smooth" });
  };

  const scrollByCard = (direction: 1 | -1) => goTo(active + direction);

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
    // No pointer capture yet: capturing here would retarget the click that
    // follows a plain press-and-release to this container, so the tile's
    // link would never receive it and a mouse click wouldn't navigate.
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (!draggedRef.current && Math.abs(delta) > 5) {
      // Only now is it a drag: capture so it keeps tracking outside the row.
      draggedRef.current = true;
      node.setPointerCapture(event.pointerId);
      setDragging(true);
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
        onScroll={updatePosition}
        // The tiles are links with images, which the browser would otherwise
        // start dragging natively (HTML drag-and-drop) - that cancels the
        // pointer stream, so the row wouldn't scroll on a mouse drag.
        onDragStart={(event) => event.preventDefault()}
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

      {stops > 1 ? (
        // Not positioned itself, so from sm up the arrows can sit absolutely
        // beside the row (against the outer wrapper) while on phones they
        // flank the dots.
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={t("common.carousel.prev")}
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            className={cn(ARROW_CLASS, SIDE_ARROW_CLASS, "sm:left-0 sm:-translate-x-1/2")}
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <div className="flex items-center">
            {Array.from({ length: stops }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t("common.carousel.goTo", { index: index + 1 })}
                aria-current={index === active ? "true" : undefined}
                onClick={() => goTo(index)}
                // 24px hit area (WCAG 2.5.8) around a small dot.
                className="group inline-flex size-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
              >
                <span
                  aria-hidden
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    index === active ? "w-5 bg-brand-gold-light" : "w-2 bg-brand-gold/35 group-hover:bg-brand-gold/70"
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={t("common.carousel.next")}
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            className={cn(ARROW_CLASS, SIDE_ARROW_CLASS, "sm:right-0 sm:translate-x-1/2")}
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
