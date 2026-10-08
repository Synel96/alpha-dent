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

  it("nyitva is a hívás az első, az e-mail tartalékként mellette", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-28T08:00:00Z"));
    render(<OpenStatusCard />);
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "tel:+36208080600",
      "mailto:info@alpha-dent.eu",
    ]);
  });

  it("a nem aktuális állapot rétege rejtett, így a kártya magassága nem változik hidratáláskor", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-28T08:00:00Z"));
    const { container } = render(<OpenStatusCard />);
    const layers = container.firstElementChild!.children;
    expect(layers).toHaveLength(2);
    expect(layers[0]).not.toHaveAttribute("aria-hidden");
    expect(layers[1]).toHaveAttribute("aria-hidden", "true");
    expect(layers[1]).toHaveClass("invisible");
  });
});
