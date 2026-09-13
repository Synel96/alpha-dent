import { describe, it, expect } from "vitest";
import rootTitle from "../../pages/+title";
import rootDescription from "../../pages/+description";
import contactTitle from "../../pages/kapcsolat/+title";
import contactDescription from "../../pages/kapcsolat/+description";
import faqTitle from "../../pages/kerdesek/+title";
import servicesTitle from "../../pages/szolgaltatasaink/+title";
import clinicTitle from "../../pages/klinikank/+title";
import storyTitle from "../../pages/tortenetunk/+title";

describe("Per-oldal title/description függvények", () => {
  it("a gyökér title/description nyelvfüggő", () => {
    expect(rootTitle({ locale: "hu" })).toBe("Alpha Dent Fogászat - Sopron");
    expect(rootTitle({ locale: "en" })).toBe("Alpha Dent Dental Clinic - Sopron, Hungary");
    expect(rootDescription({ locale: "de" })).toContain("Zahnmedizin");
  });

  it("a kapcsolat oldal saját, lefordított title/description-t ad", () => {
    expect(contactTitle({ locale: "hu" })).toBe("Kapcsolat | Alpha Dent");
    expect(contactTitle({ locale: "en" })).toBe("Contact | Alpha Dent");
    expect(contactDescription({ locale: "it" })).toContain("consulenza");
  });

  it("a GYIK és szolgáltatások oldal címe a saját tartalmát tükrözi", () => {
    expect(faqTitle({ locale: "hu" })).toBe("Gyakran Ismételt Kérdések | Alpha Dent");
    expect(servicesTitle({ locale: "en" })).toBe("What you can count on us for | Alpha Dent");
  });

  it("a hamarosan-oldalak (klinikank/tortenetunk) a nav címkéket használják", () => {
    expect(clinicTitle({ locale: "hu" })).toBe("Klinikánk | Alpha Dent");
    expect(storyTitle({ locale: "en" })).toBe("Our Story | Alpha Dent");
  });
});
