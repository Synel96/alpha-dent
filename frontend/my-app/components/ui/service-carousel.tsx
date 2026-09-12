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

  const scrollByCard = (direction: 1 | -1) => {
    const node = scrollRef.current;
    if (!node) return;
    const card = node.firstElementChild as HTMLElement | null;
    const gap = 16;
    const amount = (card?.offsetWidth ?? node.clientWidth * 0.8) + gap;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
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
