import React from "react";

// Scroll-triggered reveal: content stays fully opaque (so it's never hidden
// from crawlers, Lighthouse, or a user without JS) and only slides up a few
// pixels once its container enters the viewport. Skip this above the fold
// (e.g. the hero) - it delays nothing there and just adds animation cost to
// content that should already be visible on first paint.
export function useReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.22,
  rootMargin = "0px 0px -10% 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
