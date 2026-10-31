import * as React from "react";
import { CalendarCheck, ChevronDown, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBookingCta } from "@/components/ui/booking-dialog";
import { getHeroProgress, getHeroProgressServerSnapshot, subscribeHeroProgress } from "@/components/ui/hero";
import { CLINIC } from "@/lib/clinic-info";
import { cn } from "@/lib/utils";

// How far the hero has to have scrolled by before the bar shows: the hero's
// own call / appointment buttons sit in its lower part, so until then they
// are on screen and the bar would only repeat them.
const HERO_PASSED = 0.8;

// Whether the visitor opened or folded the bar, kept for the rest of their
// visit (sessionStorage), so it stays the way they left it on every page.
// With no choice made yet it's folded: only the calendar button shows.
const COLLAPSED_KEY = "alphadent:actionBarCollapsed";

function readCollapsed(): boolean {
  try {
    return window.sessionStorage.getItem(COLLAPSED_KEY) !== "0";
  } catch {
    return true;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    window.sessionStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // Storage blocked (e.g. private mode): the choice just isn't remembered.
  }
}

// Phones only: "Hívás" and "Időpontot kérek" pinned to the bottom of the
// screen, so they're always a thumb away while reading. Hidden while the
// menu drawer is open, and on pages with a hero until it has scrolled by.
// It only appears once mounted (it slides in), so the prerendered page -
// which can't know the hero's progress - never flashes it.
//
// On a small screen a bar that's always there gets in the way of the
// photos, so by default it's folded: only a small round calendar button
// sits in the corner, and opens the bar (which can be folded again).
export function MobileActionBar({ hidden = false }: { hidden?: boolean }) {
  const { t } = useTranslation();
  const booking = useBookingCta();
  const heroProgress = React.useSyncExternalStore(
    subscribeHeroProgress,
    getHeroProgress,
    getHeroProgressServerSnapshot
  );
  const [mounted, setMounted] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const collapseRef = React.useRef<HTMLButtonElement>(null);
  const expandRef = React.useRef<HTMLButtonElement>(null);
  // Only move focus after the visitor's own click, not on mount.
  const focusAfterToggle = React.useRef(false);

  React.useEffect(() => {
    setCollapsed(readCollapsed());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!focusAfterToggle.current) return;
    focusAfterToggle.current = false;
    (collapsed ? expandRef : collapseRef).current?.focus();
  }, [collapsed]);

  const toggle = (next: boolean) => {
    focusAfterToggle.current = true;
    writeCollapsed(next);
    setCollapsed(next);
  };

  const available = mounted && !hidden && heroProgress >= HERO_PASSED;
  const barShown = available && !collapsed;
  const handleShown = available && collapsed;

  return (
    <>
      <div
        data-testid="mobile-action-bar"
        aria-hidden={barShown ? undefined : true}
        inert={!barShown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-brand-gold/25 bg-brand-black/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
          barShown ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* On the narrowest phones (under 360px, e.g. an iPhone SE) the call
            button shows only its icon, so "Időpontot kérek" fits on one line. */}
        <div className="mx-auto flex max-w-md items-stretch gap-2 min-[360px]:gap-3">
          <a
            href={`tel:${CLINIC.phoneE164}`}
            aria-label={t("home.hero.call")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-gold/45 px-3.5 py-3 text-sm font-medium min-[360px]:flex-1 text-brand-gold-light transition-colors hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
          >
            <Phone aria-hidden className="size-4" />
            <span aria-hidden className="max-[359px]:hidden">
              {t("home.hero.call")}
            </span>
          </a>
          <a
            href={booking.href}
            onClick={booking.onClick}
            className="inline-flex min-w-0 flex-[1.4] items-center justify-center gap-2 rounded-xl text-center leading-tight border border-brand-gold/70 bg-brand-gold/20 px-3 py-3 text-sm font-semibold text-brand-gold-light transition-colors hover:bg-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
          >
            <CalendarCheck aria-hidden className="size-4" />
            {t("home.intro.ctaButton")}
          </a>
          <button
            ref={collapseRef}
            type="button"
            onClick={() => toggle(true)}
            aria-label={t("common.actionBar.collapse")}
            title={t("common.actionBar.collapse")}
            className="inline-flex w-10 shrink-0 items-center justify-center rounded-xl text-brand-gold-muted transition-colors hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
          >
            <ChevronDown aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <button
        ref={expandRef}
        type="button"
        data-testid="mobile-action-bar-handle"
        onClick={() => toggle(false)}
        aria-label={t("common.actionBar.expand")}
        title={t("common.actionBar.expand")}
        aria-hidden={handleShown ? undefined : true}
        tabIndex={handleShown ? undefined : -1}
        className={cn(
          "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex size-12 items-center justify-center rounded-full border border-brand-gold/70 bg-brand-black/90 text-brand-gold-light shadow-[0_8px_24px_-8px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 motion-reduce:transition-none md:hidden",
          handleShown ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
        )}
      >
        <CalendarCheck aria-hidden className="size-5" />
      </button>
    </>
  );
}
