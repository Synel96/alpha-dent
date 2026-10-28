import React from "react";

type RevealOptions = { threshold?: number; rootMargin?: string };

// One IntersectionObserver per distinct option set, shared by every reveal
// on the page, rather than one observer per element - with a reveal on
// every section and tile of every page that adds up. Each element is
// unobserved as soon as it has been revealed.
const sharedObservers = new Map<
  string,
  { observer: IntersectionObserver; callbacks: Map<Element, () => void> }
>();

function observeOnce(node: Element, { threshold, rootMargin }: Required<RevealOptions>, onVisible: () => void) {
  const key = `${threshold}|${rootMargin}`;
  let shared = sharedObservers.get(key);
  if (!shared) {
    const callbacks = new Map<Element, () => void>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = callbacks.get(entry.target);
          callbacks.delete(entry.target);
          observer.unobserve(entry.target);
          callback?.();
        }
      },
      { threshold, rootMargin }
    );
    shared = { observer, callbacks };
    sharedObservers.set(key, shared);
  }

  const { observer, callbacks } = shared;
  callbacks.set(node, onVisible);
  observer.observe(node);
  return () => {
    callbacks.delete(node);
    observer.unobserve(node);
  };
}

// Scroll-triggered reveal: flips `visible` once the element's container
// enters the viewport. Skip this above the fold (e.g. the hero or a page's
// title block) - it delays nothing there and just holds back content that
// should already be visible on first paint.
//
// Starts out revealed - in the prerendered HTML too - so the content is all
// there even if the page's JavaScript never runs (an old browser that
// chokes on it, a failed download): an older phone once showed the home
// page as empty black gaps, every section stuck hidden. Only once the
// script runs does it hide what's below the fold - out of sight, so it can
// happen after the first paint - ready to reveal it on scroll; whatever is
// already on screen stays put. Checked in a passive effect rather than a
// layout effect: by then the browser has laid the page out for that paint,
// so reading positions costs nothing, whereas during hydration it forced
// an extra layout pass (Lighthouse's "forced reflow").
export function useReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.22,
  rootMargin = "0px 0px -10% 0px",
}: RevealOptions = {}) {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setVisible(false);
    return observeOnce(node, { threshold, rootMargin }, () => setVisible(true));
  }, []);

  return { ref, visible };
}
