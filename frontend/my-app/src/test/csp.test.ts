import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import vercelConfig from "../../vercel.json";

// The Content-Security-Policy only applies on Vercel (not in the local
// preview), so a page feature it blocks would only break in production.
function csp(): Record<string, string[]> {
  const header = vercelConfig.headers
    .flatMap((rule) => rule.headers)
    .find((entry) => entry.key === "Content-Security-Policy");
  expect(header).toBeDefined();
  return Object.fromEntries(
    header!.value.split(";").map((directive) => {
      const [name, ...sources] = directive.trim().split(/\s+/);
      return [name, sources];
    })
  );
}

describe("Content-Security-Policy (vercel.json)", () => {
  it("engedi a Cloudinary képeket", () => {
    expect(csp()["img-src"]).toContain("https://res.cloudinary.com");
  });

  it("engedi a hero videó letöltését a Cloudinaryról és a lejátszását a letöltött blobból", () => {
    // components/ui/hero.tsx fetches the whole video, then plays it from an object URL.
    expect(csp()["connect-src"]).toContain("https://res.cloudinary.com");
    expect(csp()["media-src"]).toContain("blob:");
  });

  it("nincs +client fájl: azzal a Vike inline scripttel indítaná az oldalt, amit a script-src 'self' letilt", () => {
    // That once stopped every script in production (no hydration, no hero
    // video). Code that must run first goes in via vite.config.ts instead.
    expect(csp()["script-src"]).not.toContain("'unsafe-inline'");
    const pagesDir = resolve(__dirname, "../../pages");
    const clientFiles = readdirSync(pagesDir, { recursive: true })
      .map(String)
      .filter((file) => /(^|[/\\])\+client\./.test(file));
    expect(clientFiles).toEqual([]);
  });
});
