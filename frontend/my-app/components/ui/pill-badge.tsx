import React from "react";
import { cn } from "@/lib/utils";

type PillBadgeProps = {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
};

// Small rounded label used as an "eyebrow" above a section heading, paired
// with an icon that ties it to that section's content. Mirrors the badge
// already used inside CtaButton, so the two read as one family.
export function PillBadge({ icon: Icon, children, className }: PillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-brand-gold-light",
        className
      )}
    >
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}
