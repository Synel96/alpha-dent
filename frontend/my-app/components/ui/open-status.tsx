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

// Stand-in used until the real status is known on mount: the card renders
// invisibly with it so the hero copy doesn't jump when the status appears.
const PLACEHOLDER_STATUS: OpenStatus = { open: true, closesAt: 17 * 60 };

export function OpenStatusCard() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const { status } = useOpenStatus();
  const shown = status ?? PLACEHOLDER_STATUS;

  let detail: string;
  if (shown.open) {
    detail = t("openingHours.openUntil", { time: formatClockTime(shown.closesAt) });
  } else {
    const time = formatClockTime(shown.opensAt);
    if (shown.daysUntil === 0) detail = t("openingHours.opensToday", { time });
    else if (shown.daysUntil === 1) detail = t("openingHours.opensTomorrow", { time });
    else detail = t("openingHours.opensOn", { day: weekdayName(shown.weekday, locale), time });
  }

  return (
    <div
      aria-hidden={status ? undefined : true}
      className={cn(
        "w-full max-w-sm rounded-2xl border border-brand-gold/30 bg-black/40 p-4 backdrop-blur-sm lg:bg-black/60 lg:backdrop-blur-md",
        !status && "invisible"
      )}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="relative flex size-2.5">
          {shown.open ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
          ) : null}
          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              shown.open ? "bg-emerald-400" : "bg-rose-400"
            )}
          />
        </span>
        <span className="font-semibold text-white">
          {shown.open ? t("openingHours.openNow") : t("openingHours.closedNow")}
        </span>
        <span className="text-brand-gold-light/80">· {detail}</span>
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/85">
        {shown.open ? t("openingHours.openMessage") : t("openingHours.closedMessage")}
      </p>
      {/* Calls are taken during the day even outside opening hours, so the
          phone stays the main action; when closed, e-mail is offered next to
          it for when nobody picks up. */}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={PHONE_HREF}
          tabIndex={status ? undefined : -1}
          className={cn(BUTTON_CLASS, "border-brand-gold-light/60 text-brand-gold-light hover:border-brand-gold-light hover:bg-black/35")}
        >
          <Phone aria-hidden className="size-4" />
          {CLINIC.phoneDisplay}
        </a>
        {!shown.open ? (
          <a
            href={EMAIL_HREF}
            tabIndex={status ? undefined : -1}
            className={cn(BUTTON_CLASS, "border-white/25 text-white/85 hover:border-brand-gold-light/60 hover:text-brand-gold-light")}
          >
            <Mail aria-hidden className="size-4" />
            {CLINIC.email}
          </a>
        ) : null}
      </div>
    </div>
  );
}
