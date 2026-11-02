import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CLINIC } from "@/lib/clinic-info";
import { cn } from "@/lib/utils";

type SocialLinkProps = {
  label: string;
  href: string;
  icon: ReactNode;
  /** Classes for the live link. */
  className: string;
  /** Classes for the greyed-out placeholder while the profiles are empty. */
  soonClassName: string;
};

/**
 * An Instagram/Facebook icon link. While CLINIC.socialComingSoon is on, it is a
 * greyed-out, non-clickable icon with a "coming soon" tooltip instead, so
 * visitors don't land on an empty profile.
 */
export function SocialLink({ label, href, icon, className, soonClassName }: SocialLinkProps) {
  const { t } = useTranslation();

  if (CLINIC.socialComingSoon) {
    const soon = `${label} – ${t("contactPage.cards.socialSoon")}`;
    return (
      <span
        role="img"
        aria-label={soon}
        title={soon}
        data-testid="social-soon"
        className={cn("cursor-default text-white/30", soonClassName)}
      >
        {icon}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={className}>
      {icon}
    </a>
  );
}

/** The visible "coming soon" note next to the icons; nothing once they are live. */
export function SocialSoonNote({ className }: { className?: string }) {
  const { t } = useTranslation();
  if (!CLINIC.socialComingSoon) return null;
  return <span className={cn("text-xs text-white/40", className)}>{t("contactPage.cards.socialSoon")}</span>;
}
