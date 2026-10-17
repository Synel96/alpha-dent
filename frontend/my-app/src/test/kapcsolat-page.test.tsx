import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { Page } from "../../pages/kapcsolat/+Page";

describe("Kapcsolat oldal", () => {
  it("megjeleníti a parkolási információt", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "contactPage.cards.parking" })).toBeInTheDocument();
    expect(screen.getByText("contactPage.parking")).toBeInTheDocument();
  });

  it("pontosan egy H1 címsora van (SEO, akadálymentesség)", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("megjeleníti a cím szöveges tartalmát és a térkép linket", () => {
    render(<Page />);
    expect(screen.getAllByText("9400 Sopron, Arany János u. 13.")[0]).toBeInTheDocument();
    const mapLinks = screen.getAllByRole("link", { name: /contactPage\.actions\.openMap/ });
    expect(mapLinks.length).toBeGreaterThan(0);
    for (const link of mapLinks) {
      expect(link).toHaveAttribute("href", "https://goo.gl/maps/tBZd2pfrPTJkpJVb6");
    }
  });

  it("a mobil (felső gomb), a vezetékes és az email linkek helyes href-eket kapnak", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: /contactPage\.actions\.callNow/ })).toHaveAttribute(
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
    expect(screen.getByRole("link", { name: /contactPage\.actions\.sendEmail/ })).toHaveAttribute(
      "href",
      "mailto:info@alpha-dent.eu"
    );
  });

  it("megjeleníti a heti nyitvatartást: hétfőn és vasárnap zárva, szombaton 8–13", () => {
    render(<Page />);
    expect(screen.getByText("openingHours.title")).toBeInTheDocument();
    expect(screen.getByText("Hétfő")).toBeInTheDocument();
    expect(screen.getAllByText("8:00–17:00")).toHaveLength(4);
    expect(screen.getAllByText("8:00–13:00")).toHaveLength(1);
    expect(screen.getAllByText("openingHours.closed")).toHaveLength(2);
  });

  it("nincs külön mobil, email, cím és GPS kártya (ezek a felső gombokban vannak)", () => {
    render(<Page />);
    const cardTitles = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(cardTitles).not.toContain("contactPage.cards.mobile");
    expect(cardTitles).not.toContain("contactPage.cards.address");
    expect(cardTitles).not.toContain("contactPage.cards.email");
    expect(screen.queryByText("47.6777786, 16.5896789")).not.toBeInTheDocument();
    // The address is one tap away at the top; the mobile number is there
    // too, and also heads the phone card's list (above the two landlines).
    expect(screen.getAllByText("+36 20 80 80 600")).toHaveLength(2);
    const phoneCard = screen.getByRole("heading", { level: 2, name: "contactPage.cards.phone" }).closest("article")!;
    expect(within(phoneCard).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "+36 20 80 80 600",
      "+36 99 788 888",
      "+36 99 340 707",
    ]);
    expect(screen.getByText("9400 Sopron, Arany János u. 13.")).toBeInTheDocument();
  });
});
