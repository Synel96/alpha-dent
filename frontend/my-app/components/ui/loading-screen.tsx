import React from "react";
import { AlphaGlyph } from "./alpha-glyph";

const FADE_MS = 500;

// The spinner and the glow only exist while the screen is showing (and for
// its fade-out), and the overlay is `invisible` the rest of the time. Left
// mounted at opacity 0, the two infinite animations kept running on every
// page under a full-screen layer - work a phone has to redo for the whole
// screen when the visitor comes back from another app (seen as flicker),
// and battery spent on something never seen.
export function LoadingScreen({ visible }: { visible: boolean }) {
  const [rendered, setRendered] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setRendered(true);
      return;
    }
    const timer = window.setTimeout(() => setRendered(false), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const shown = visible || rendered;

  return (
    <div
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black transition-opacity ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${shown ? "" : "invisible"}`}
      aria-hidden={!visible}
    >
      {shown ? (
        <div className="relative flex items-center justify-center">
          {/* Spinning gold ring */}
          <div className="h-24 w-24 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
          {/* Glowing α in center */}
          <AlphaGlyph glow className="absolute text-4xl" />
        </div>
      ) : null}
    </div>
  );
}
