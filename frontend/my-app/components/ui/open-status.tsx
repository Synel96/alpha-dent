import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { cn } from "@/lib/utils";
import { formatClockTime, weekdayName, type OpenStatus } from "@/lib/opening-hours";
import { useOpenStatus } from "@/lib/use-open-status";

const PHONE_DISPLAY = "+36 20 80 80 600";
const PHONE_HREF = "tel:+36208080600";
const EMAIL = "info@alpha-dent.eu";

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
        "w-full max-w-sm rounded-2xl border border-brand-gold/30 bg-black/40 p-4 backdrop-blur-sm",
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
      <a
        href={shown.open ? PHONE_HREF : `mailto:${EMAIL}`}
        tabIndex={status ? undefined : -1}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-gold-light/60 px-4 py-2 text-sm font-medium text-brand-gold-light transition-colors hover:border-brand-gold-light hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
      >
        {shown.open ? <Phone aria-hidden className="size-4" /> : <Mail aria-hidden className="size-4" />}
        {shown.open ? PHONE_DISPLAY : EMAIL}
      </a>
    </div>
  );
}
