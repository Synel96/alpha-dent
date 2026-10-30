import * as React from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBookingCta } from "@/components/ui/booking-dialog";
import { getHeroProgress, getHeroProgressServerSnapshot, subscribeHeroProgress } from "@/components/ui/hero";
import { CLINIC } from "@/lib/clinic-info";
import { cn } from "@/lib/utils";

// How far the hero has to have scrolled by before the bar shows: the hero's
// own call / appointment buttons sit in its lower part, so until then they
// are on screen and the bar would only repeat them.
const HERO_PASSED = 0.8;

// Phones only: "Hívás" and "Időpontot kérek" pinned to the bottom of the
// screen, so they're always a thumb away while reading. Hidden while the
// menu drawer is open, and on pages with a hero until it has scrolled by.
// It only appears once mounted (it slides in), so the prerendered page -
// which can't know the hero's progress - never flashes it.
export function MobileActionBar({ hidden = false }: { hidden?: boolean }) {
  const { t } = useTranslation();
  const booking = useBookingCta();
  const heroProgress = React.useSyncExternalStore(
    subscribeHeroProgress,
    getHeroProgress,
    getHeroProgressServerSnapshot
  );
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const visible = mounted && !hidden && heroProgress >= HERO_PASSED;

  return (
    <div
      data-testid="mobile-action-bar"
      aria-hidden={visible ? undefined : true}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brand-gold/25 bg-brand-black/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          href={`tel:${CLINIC.phoneE164}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-gold/45 px-4 py-3 text-sm font-medium text-brand-gold-light transition-colors hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
        >
          <Phone aria-hidden className="size-4" />
          {t("home.hero.call")}
        </a>
        <a
          href={booking.href}
          onClick={booking.onClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-gold/70 bg-brand-gold/20 px-4 py-3 text-sm font-semibold text-brand-gold-light transition-colors hover:bg-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
        >
          <CalendarCheck aria-hidden className="size-4" />
          {t("home.intro.ctaButton")}
        </a>
      </div>
    </div>
  );
}
