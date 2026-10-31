import { describe, it, expect, vi } from "vitest";

const inject = vi.fn();
vi.mock("@vercel/analytics", () => ({ inject: (options: unknown) => inject(options) }));

import { startAnalytics } from "../../lib/analytics";
import { privacyPolicy } from "../../lib/privacy-policy";
import { LOCALES } from "../../lib/locale";
import vercelConfig from "../../vercel.json";

describe("Sütimentes látogatottságmérés (Vercel Web Analytics)", () => {
  it("a Vercel Web Analytics szkriptjét tölti be, a Vike keretrendszer jelölésével", () => {
    startAnalytics();
    expect(inject).toHaveBeenCalledWith({ framework: "vike" });
  });

  it("a CSP engedi a saját domainről jövő szkriptet és a mérés elküldését (script-src / connect-src 'self')", () => {
    const value = vercelConfig.headers
      .flatMap((rule) => rule.headers)
      .find((entry) => entry.key === "Content-Security-Policy")!.value;
    expect(value).toMatch(/script-src 'self'/);
    expect(value).toMatch(/connect-src 'self'/);
  });

  it("az adatkezelési tájékoztató minden nyelven leírja (3.5. pont), és továbbra is sütimentesnek mondja az oldalt", () => {
    for (const locale of LOCALES) {
      const text = JSON.stringify(privacyPolicy(locale));
      expect(text, locale).toContain("3.5.");
      expect(text, locale).toContain("Vercel Web Analytics");
      // The cookies section must no longer say "no analytics".
      const cookies = JSON.stringify(privacyPolicy(locale).sections.find((section) => section.id === "sutik"));
      expect(cookies, locale).toContain("3.5");
      // The mobile action bar's open/folded state (sessionStorage) is disclosed.
      expect(cookies, locale).toContain("sessionStorage");
    }
  });
});
