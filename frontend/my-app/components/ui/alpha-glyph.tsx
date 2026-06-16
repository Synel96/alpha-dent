import React from "react";

interface AlphaGlyphProps {
  /** Extra Tailwind classes, e.g. for size overrides */
  className?: string;
  /** Whether to apply the pulsing glow animation */
  glow?: boolean;
}

export function AlphaGlyph({ className = "", glow = false }: AlphaGlyphProps) {
  return (
    <span
      style={{ fontFamily: '"Geist Variable", Georgia, "Times New Roman", serif' }}
      className={`font-semibold text-brand-gold leading-none select-none ${
        glow ? "loading-alpha-glow" : ""
      } ${className}`}
    >
      &alpha;
    </span>
  );
}
