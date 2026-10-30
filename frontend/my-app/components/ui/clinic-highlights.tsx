import { Award, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Highlight = { value: string; label: string };

// Same order as clinicPage.highlights: since 1996, team, CAMLOG Gold.
const HIGHLIGHT_ICONS = [Building2, Users, Award] as const;

// The clinic's trust numbers (since 1996, the team, CAMLOG Gold) as a row of
// cards: on the Klinikánk page under its intro, and on the home page right
// after its intro, where a first-time visitor sees them at a glance.
export function ClinicHighlights({ className }: { className?: string }) {
  const { t } = useTranslation();
  const highlights = t("clinicPage.highlights", { returnObjects: true }) as Highlight[];

  return (
    <ul className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {highlights.map((item, index) => {
        const Icon = HIGHLIGHT_ICONS[index];
        return (
          <li
            key={item.value}
            className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.14),transparent_55%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-5"
          >
            {Icon ? (
              <span
                aria-hidden
                className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light"
              >
                <Icon className="size-5" />
              </span>
            ) : null}
            <p className="text-2xl font-semibold text-brand-gold-light md:text-3xl">{item.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{item.label}</p>
          </li>
        );
      })}
    </ul>
  );
}
