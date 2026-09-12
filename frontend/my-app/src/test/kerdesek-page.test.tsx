import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: vi.fn(),
}));

import { usePageContext } from "vike-react/usePageContext";
import { Page } from "../../pages/kerdesek/+Page";

const mockPageContext = usePageContext as ReturnType<typeof vi.fn>;

describe("Kerdesek (FAQ) oldal", () => {
  it("mind a 15 kérdést megjeleníti, összecsukható panelként", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    render(<Page />);
    expect(screen.getByText("faqPage.items.q1.question")).toBeInTheDocument();
    expect(screen.getByText("faqPage.items.q15.question")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /faqPage\.items\.q\d+\.question/ })).toHaveLength(
      15
    );
  });

  it("a kapcsolatfelvétel CTA gomb az aktuális nyelv prefixelt kapcsolat oldalára mutat (en)", () => {
    mockPageContext.mockReturnValue({ locale: "en" });
    render(<Page />);
    expect(screen.getByRole("link", { name: "faqPage.ctaButton" })).toHaveAttribute(
      "href",
      "/en/kapcsolat"
    );
  });

  it("a kapcsolatfelvétel CTA gomb alapértelmezett (hu) nyelven prefix nélküli útvonalra mutat", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    render(<Page />);
    expect(screen.getByRole("link", { name: "faqPage.ctaButton" })).toHaveAttribute(
      "href",
      "/kapcsolat"
    );
  });
});
