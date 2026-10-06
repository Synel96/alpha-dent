import React from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/use-reveal";

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
};

// Fades a whole block up into place once it scrolls into view. Shares the
// same mechanics as the homepage intro section (see lib/use-reveal.ts) but
// as a single unit rather than staggering each child individually - a
// simpler fit for the longer text sections below.
//
// threshold 0 (fire as soon as the block's top edge clears the bottom 12% of
// the viewport) rather than a visible-area ratio: a block several screens
// tall, e.g. a photo grid stacked on a phone, could otherwise never reach
// the ratio and would stay invisible.
export function RevealSection({ children, className }: RevealSectionProps) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0, rootMargin: "0px 0px -12% 0px" });

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

type RevealGroupProps = {
  children: React.ReactNode;
  // How many leading children to leave alone: the page's above-the-fold
  // title block (and its LCP image) should paint straight away, not wait
  // for hydration and a scroll observer.
  skip?: number;
};

// Wraps each of its children (after the first `skip`) in a RevealSection, so
// a page's top-level sections fade in one by one as they're scrolled to.
// Returns a fragment: the parent's space-y-* spacing still applies, just to
// the wrappers.
export function RevealGroup({ children, skip = 0 }: RevealGroupProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) =>
        index < skip ? (
          child
        ) : (
          <RevealSection key={React.isValidElement(child) && child.key !== null ? child.key : index}>
            {child}
          </RevealSection>
        )
      )}
    </>
  );
}
