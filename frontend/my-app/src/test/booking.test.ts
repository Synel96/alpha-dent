import { describe, it, expect } from "vitest";
import { bookingMailto } from "../../lib/booking";
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
});
