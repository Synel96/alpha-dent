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
    expect(rootTitle({ locale: "hu" })).toBe("Alphadent Fogászat - Sopron");
    expect(rootTitle({ locale: "en" })).toBe("Alphadent Dental Clinic - Sopron, Hungary");
    expect(rootDescription({ locale: "de" })).toContain("Zahnmedizin");
  });

  it("a kapcsolat oldal saját, lefordított title/description-t ad", () => {
    expect(contactTitle({ locale: "hu" })).toBe("Kapcsolat | Alphadent");
    expect(contactTitle({ locale: "en" })).toBe("Contact | Alphadent");
    expect(contactDescription({ locale: "it" })).toContain("consulenza");
  });

  it("a GYIK és szolgáltatások oldal címe a saját tartalmát tükrözi", () => {
    expect(faqTitle({ locale: "hu" })).toBe("Gyakran Ismételt Kérdések | Alphadent");
    expect(servicesTitle({ locale: "en" })).toBe("What you can count on us for | Alphadent");
  });

  it("a hamarosan-oldalak (klinikank/tortenetunk) a nav címkéket használják", () => {
    expect(clinicTitle({ locale: "hu" })).toBe("Klinikánk | Alphadent");
    expect(storyTitle({ locale: "en" })).toBe("Our Story | Alphadent");
  });
});
