import React from "react";
import { cn } from "@/lib/utils";

type CtaButtonProps = {
  href: string;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
} & Omit<React.ComponentProps<"a">, "href" | "children" | "className">;

export function CtaButton({
  href,
  title,
  subtitle,
  badge = "Kiemelt",
  className,
  ...props
}: CtaButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex min-w-[240px] items-center gap-4 overflow-hidden rounded-xl border border-brand-gold/45",
        "bg-[radial-gradient(circle_at_20%_20%,rgba(228,196,106,0.22),transparent_55%),linear-gradient(135deg,rgba(201,168,76,0.20),rgba(17,17,20,0.96))]",
        "px-5 py-4 text-left text-brand-gold shadow-[0_0_0_1px_rgba(201,168,76,0.12),0_10px_28px_-12px_rgba(201,168,76,0.45)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-[0_0_0_1px_rgba(228,196,106,0.3),0_16px_34px_-12px_rgba(201,168,76,0.7)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black",
        className
      )}
      aria-label={title}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute -left-10 top-0 h-full w-10 -skew-x-12 bg-gradient-to-r from-transparent via-brand-gold-light/55 to-transparent transition-transform duration-700 group-hover:translate-x-[320px]" />
      </span>

      <span className="relative z-10 flex min-w-0 flex-col">
        <span className="mb-1 inline-flex w-fit items-center rounded-full border border-brand-gold/40 bg-brand-black/45 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-brand-gold-light">
          {badge}
        </span>
        <span className="text-base font-semibold leading-tight text-brand-gold-light">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-1 text-xs leading-relaxed text-brand-gold-muted">
            {subtitle}
          </span>
        ) : null}
      </span>

      <span className="relative z-10 ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/50 text-xl text-brand-gold transition-colors duration-300 group-hover:text-brand-gold-light">
        »
      </span>
    </a>
  );
}
