import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { Page } from "../../pages/kapcsolat/+Page";

describe("Kapcsolat oldal", () => {
  it("megjeleníti a cím szöveges tartalmát és a térkép linket", () => {
    render(<Page />);
    expect(screen.getAllByText("9400 Sopron, Arany János u. 13.")[0]).toBeInTheDocument();
    const mapLinks = screen.getAllByRole("link", { name: "contactPage.actions.openMap" });
    expect(mapLinks.length).toBeGreaterThan(0);
    for (const link of mapLinks) {
      expect(link).toHaveAttribute("href", "https://goo.gl/maps/tBZd2pfrPTJkpJVb6");
    }
  });

  it("a mobil, telefon és email linkek helyes href-eket kapnak", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "+36 20 80 80 600" })).toHaveAttribute(
      "href",
      "tel:+36208080600"
    );
    expect(screen.getByRole("link", { name: "+36 99 788 888" })).toHaveAttribute(
      "href",
      "tel:+3699788888"
    );
    expect(screen.getByRole("link", { name: "+36 99 340 707" })).toHaveAttribute(
      "href",
      "tel:+3699340707"
    );
    expect(screen.getByRole("link", { name: "info@alpha-dent.eu" })).toHaveAttribute(
      "href",
      "mailto:info@alpha-dent.eu"
    );
  });

  it("a GPS koordinátákat és a hozzá tartozó navigációs linket megjeleníti", () => {
    render(<Page />);
    expect(screen.getByText("47.6777786, 16.5896789")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contactPage.actions.openByGps" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=47.6777786,16.5896789"
    );
  });
});
