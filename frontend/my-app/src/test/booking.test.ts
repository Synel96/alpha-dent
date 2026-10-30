import { describe, it, expect } from "vitest";
import { bookingMailto, bookingWebmailLinks, isDesktopPointer } from "../../lib/booking";
import { bookingResources } from "../../lib/i18n/booking";
import i18n from "../../lib/i18n";
import { LOCALES } from "../../lib/locale";

describe("Időpontkérő e-mail", () => {
  it("az info@ címre szól, a tárgy és a szöveg kódolva van, a sortörések CRLF-ek", () => {
    const href = bookingMailto("Időpontkérés", "Név: \nKezelés: Implantológia");
    expect(href.startsWith("mailto:info@alpha-dent.eu?subject=")).toBe(true);
    const params = new URLSearchParams(href.slice(href.indexOf("?") + 1));
    expect(params.get("subject")).toBe("Időpontkérés");
    expect(params.get("body")).toBe("Név: \r\nKezelés: Implantológia");
    // Spaces as %20, not "+": mail apps show a "+" literally.
    expect(href).not.toContain("+");
  });

  it("minden nyelven van tárgy és szöveg, a szövegben a kezelés helyével", () => {
    for (const locale of LOCALES) {
      const { subject, body } = bookingResources[locale].booking;
      expect(subject, locale).not.toBe("");
      expect(body, locale).toContain("{{service}}");
    }
  });

  it("a szolgáltatás oldalon a kezelés be van írva a levélbe", () => {
    const t = i18n.getFixedT("hu");
    const body = t("booking.body", { service: t("services.implantologia.nav") });
    expect(body).toContain("Kezelés: Implantológia\n");
  });

  it("a Gmail és Outlook.com linkek a klinika címére, kódolt tárggyal és szöveggel szólnak", () => {
    const { gmail, outlook } = bookingWebmailLinks("Időpontkérés & kérdés", "Első sor\nMásodik: 100%");
    const g = new URL(gmail);
    expect(`${g.origin}${g.pathname}`).toBe("https://mail.google.com/mail/");
    expect(g.searchParams.get("view")).toBe("cm");
    expect(g.searchParams.get("to")).toBe("info@alpha-dent.eu");
    expect(g.searchParams.get("su")).toBe("Időpontkérés & kérdés");
    expect(g.searchParams.get("body")).toBe("Első sor\r\nMásodik: 100%");
    const o = new URL(outlook);
    expect(`${o.origin}${o.pathname}`).toBe("https://outlook.live.com/mail/0/deeplink/compose");
    expect(o.searchParams.get("subject")).toBe("Időpontkérés & kérdés");
    expect(o.searchParams.get("body")).toBe("Első sor\r\nMásodik: 100%");
  });

  it("számítógépnek csak egér/touchpad (finom mutató, hover) számít", () => {
    const original = window.matchMedia;
    const queries: string[] = [];
    window.matchMedia = ((query: string) => {
      queries.push(query);
      return { matches: true } as MediaQueryList;
    }) as typeof window.matchMedia;
    expect(isDesktopPointer()).toBe(true);
    expect(queries).toEqual(["(hover: hover) and (pointer: fine)"]);
    window.matchMedia = original;
    expect(isDesktopPointer()).toBe(false);
  });
});
