import React from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/use-reveal";

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
};

// Fades a whole block up into place once it scrolls into view. Shares the
// same translate-only-until-visible mechanics as the homepage intro section
// (see lib/use-reveal.ts) but as a single unit rather than staggering each
// child individually - a simpler fit for the longer text sections below.
export function RevealSection({ children, className }: RevealSectionProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
