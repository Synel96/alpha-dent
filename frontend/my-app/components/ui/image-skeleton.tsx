import React from "react";
import { cn } from "@/lib/utils";

// Tracks whether an <img> has finished loading. Also checks `complete` on
// mount: a prerendered image can finish before React hydrates and attaches
// onLoad, and without this its skeleton would never go away.
export function useImageLoaded() {
  const ref = React.useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  const onLoad = React.useCallback(() => setLoaded(true), []);
  // A failed image shouldn't shimmer forever either.
  const onError = onLoad;

  return { ref, loaded, onLoad, onError };
}

// Shimmering placeholder for an image slot. Render it BEFORE the <img> in
// the same positioned box: the image then paints over it as soon as (and
// as far as) it has loaded, with no JS involved - so the photo is never held
// back waiting for hydration - and `visible` just unmounts the skeleton
// afterwards. The shimmer only animates transform (see .image-skeleton in
// pages/Layout.css), so it stays on the compositor.
export function ImageSkeleton({ visible, className }: { visible: boolean; className?: string }) {
  if (!visible) return null;
  return <span aria-hidden className={cn("image-skeleton", className)} />;
}
