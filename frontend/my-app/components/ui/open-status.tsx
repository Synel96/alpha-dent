import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { cn } from "@/lib/utils";
import { CLINIC } from "@/lib/clinic-info";
import { formatClockTime, weekdayName, type OpenStatus } from "@/lib/opening-hours";
import { useOpenStatus } from "@/lib/use-open-status";

const PHONE_HREF = `tel:${CLINIC.phoneE164}`;
const EMAIL_HREF = `mailto:${CLINIC.email}`;

const BUTTON_CLASS =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

// Typical states, used for whichever layer isn't the current one (and for
// both before the real status is known on mount).
const SAMPLE_OPEN: OpenStatus = { open: true, closesAt: 17 * 60 };
const SAMPLE_CLOSED: OpenStatus = { open: false, opensAt: 8 * 60, weekday: 0, daysUntil: 3 };

// The open and closed layouts can differ in height (different message
// lengths). Both are rendered on top of each other in a
// single grid cell and only the current one is visible, so the card is
// always as tall as the taller of the two: it never changes height when the
// real status appears after hydration - which, in the vertically centred
// hero, used to shift the whole hero (CLS) depending on the time of day.
export function OpenStatusCard() {
  const { status } = useOpenStatus();

  return (
    <div
      aria-hidden={status ? undefined : true}
      className={cn(
        "grid w-full max-w-sm rounded-2xl border border-brand-gold/30 bg-black/40 p-4 backdrop-blur-sm lg:bg-black/60 lg:backdrop-blur-md",
        !status && "invisible"
      )}
    >
      <StatusLayer state={status?.open ? status : SAMPLE_OPEN} active={status?.open === true} />
      <StatusLayer state={status && !status.open ? status : SAMPLE_CLOSED} active={status?.open === false} />
    </div>
  );
}

function StatusLayer({ state, active }: { state: OpenStatus; active: boolean }) {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  let detail: string;
  if (state.open) {
    detail = t("openingHours.openUntil", { time: formatClockTime(state.closesAt) });
  } else {
    const time = formatClockTime(state.opensAt);
    if (state.daysUntil === 0) detail = t("openingHours.opensToday", { time });
    else if (state.daysUntil === 1) detail = t("openingHours.opensTomorrow", { time });
    else detail = t("openingHours.opensOn", { day: weekdayName(state.weekday, locale), time });
  }

  return (
    <div
      aria-hidden={active ? undefined : true}
      className={cn("self-center [grid-area:1/1]", !active && "invisible")}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="relative flex size-2.5">
          {state.open && active ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
          ) : null}
          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              state.open ? "bg-emerald-400" : "bg-rose-400"
            )}
          />
        </span>
        <span className="font-semibold text-white">
          {state.open ? t("openingHours.openNow") : t("openingHours.closedNow")}
        </span>
        <span className="text-brand-gold-light/80">· {detail}</span>
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/85">
        {state.open ? t("openingHours.openMessage") : t("openingHours.closedMessage")}
      </p>
      {/* Calls are taken during the day even outside opening hours, so the
          phone is always the main action, with e-mail next to it for when
          nobody picks up. */}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={PHONE_HREF}
          tabIndex={active ? undefined : -1}
          className={cn(BUTTON_CLASS, "border-brand-gold-light/60 text-brand-gold-light hover:border-brand-gold-light hover:bg-black/35")}
        >
          <Phone aria-hidden className="size-4" />
          {CLINIC.phoneDisplay}
        </a>
        <a
          href={EMAIL_HREF}
          tabIndex={active ? undefined : -1}
          className={cn(BUTTON_CLASS, "border-white/25 text-white/85 hover:border-brand-gold-light/60 hover:text-brand-gold-light")}
        >
          <Mail aria-hidden className="size-4" />
          {CLINIC.email}
        </a>
      </div>
    </div>
  );
}
