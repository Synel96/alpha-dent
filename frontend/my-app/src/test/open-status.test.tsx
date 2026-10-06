import { render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { OpenStatusCard } from "../../components/ui/open-status";

afterEach(() => {
  vi.useRealTimers();
});

describe("OpenStatusCard", () => {
  it("nyitvatartási időben hívásra buzdít telefonszámmal", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-28T08:00:00Z"));
    render(<OpenStatusCard />);

    expect(screen.getByText("openingHours.openNow")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+36 20 80 80 600" })).toHaveAttribute(
      "href",
      "tel:+36208080600"
    );
  });

  it("zárva is a hívás az első lehetőség (napközben veszik fel), mellette az e-mail", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-03T10:00:00Z"));
    render(<OpenStatusCard />);

    expect(screen.getByText("openingHours.closedNow")).toBeInTheDocument();
    expect(screen.getByText("openingHours.closedMessage")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "tel:+36208080600",
      "mailto:info@alpha-dent.eu",
    ]);
  });

  it("nyitva csak a hívás gomb látszik", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-28T08:00:00Z"));
    render(<OpenStatusCard />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
