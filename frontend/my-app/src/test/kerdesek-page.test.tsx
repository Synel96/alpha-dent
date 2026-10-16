import { render, screen, within } from "@testing-library/react";
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
  it("pontosan egy H1 címsora van (SEO, akadálymentesség)", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("a 16 kérdést 4 témakörben, összecsukható panelként jeleníti meg, a megközelítéssel kezdve", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    render(<Page />);
    const topics = screen.getAllByRole("heading", { level: 2, name: /faqPage\.topics\./ });
    expect(topics.map((heading) => heading.textContent)).toEqual([
      "faqPage.topics.location.title",
      "faqPage.topics.international.title",
      "faqPage.topics.treatment.title",
      "faqPage.topics.costs.title",
    ]);
    const questions = screen.getAllByRole("button", { name: /faqPage\.items\.q\d+\.question/ });
    expect(questions).toHaveLength(16);
    // Each question is listed once; the duplicates (q11, q12) are gone.
    expect(new Set(questions.map((button) => button.textContent)).size).toBe(16);
    expect(screen.queryByText("faqPage.items.q11.question")).not.toBeInTheDocument();
    // Getting here first, and only the very first question starts open.
    expect(questions[0]).toHaveTextContent("faqPage.items.q16.question");
    expect(questions.filter((button) => button.getAttribute("aria-expanded") === "true")).toHaveLength(1);
    expect(questions[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("a témák gombsora a téma szekcióira ugrik, és a panelazonosítók egyediek", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    const { container } = render(<Page />);
    const nav = screen.getByRole("navigation", { name: "faqPage.topicsLabel" });
    for (const link of within(nav).getAllByRole("link")) {
      const target = link.getAttribute("href")!;
      expect(container.querySelector(target)).not.toBeNull();
    }
    const panelIds = [...container.querySelectorAll("[role=region]")].map((panel) => panel.id);
    expect(new Set(panelIds).size).toBe(panelIds.length);
  });

  it("a kapcsolatfelvétel CTA gomb az aktuális nyelv prefixelt kapcsolat oldalára mutat (en)", () => {
    mockPageContext.mockReturnValue({ locale: "en" });
    render(<Page />);
    expect(screen.getByRole("link", { name: /faqPage\.ctaButton/ })).toHaveAttribute(
      "href",
      "/en/contact"
    );
  });

  it("a kapcsolatfelvétel CTA gomb alapértelmezett (hu) nyelven is a /hu prefixelt útvonalra mutat", () => {
    mockPageContext.mockReturnValue({ locale: "hu" });
    render(<Page />);
    expect(screen.getByRole("link", { name: /faqPage\.ctaButton/ })).toHaveAttribute(
      "href",
      "/hu/kapcsolat"
    );
  });
});
