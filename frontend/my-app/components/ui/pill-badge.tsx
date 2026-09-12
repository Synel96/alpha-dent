import React from "react";
import { cn } from "@/lib/utils";

type PillBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

// Small rounded label used as an "eyebrow" above a section heading. Mirrors
// the badge already used inside CtaButton, so the two read as one family.
export function PillBadge({ children, className }: PillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-brand-gold/40 bg-brand-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-brand-gold-light",
        className
      )}
    >
      {children}
    </span>
  );
}
