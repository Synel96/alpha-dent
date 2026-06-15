import React from "react";
import { AlphaGlyph } from "./alpha-glyph";

export function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning gold ring */}
        <div className="h-24 w-24 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        {/* Glowing α in center */}
        <AlphaGlyph glow className="absolute text-4xl" />
      </div>
    </div>
  );
}
