import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { privacyPolicy } from "../../lib/privacy-policy";
import { LOCALES } from "../../lib/locale";

let mockLocale = "hu";
vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: mockLocale }),
}));

import { Page } from "../../pages/adatkezelesi-tajekoztato/+Page";

const textOf = (locale: (typeof LOCALES)[number]) => JSON.stringify(privacyPolicy(locale));

describe("Adatkezelési tájékoztató", () => {
  it("minden nyelven ugyanazok a szakaszok vannak, ugyanabban a sorrendben", () => {
    const ids = privacyPolicy("hu").sections.map((section) => section.id);
    expect(ids).toHaveLength(10);
    for (const locale of LOCALES) {
      expect(privacyPolicy(locale).sections.map((section) => section.id)).toEqual(ids);
    }
  });

  it("minden nyelven hivatkozik a kulcs jogszabályhelyekre", () => {
    for (const locale of LOCALES) {
      const text = textOf(locale);
      for (const reference of ["2016/679", "CXII", "XLVII", "CVIII", "13/A", "155", "2023/1795"]) {
        expect(text, `${locale}: ${reference}`).toContain(reference);
      }
      // GDPR articles for each right and the remedies.
      for (const article of ["15", "16", "17", "18", "20", "21", "22", "77", "79"]) {
        expect(text, `${locale}: Art. ${article}`).toMatch(new RegExp(`\\b${article}\\b`));
      }
    }
  });

  it("a cégadatokat a közös forrásból veszi, és a ki nem töltött mezők nem jelennek meg", () => {
    for (const locale of LOCALES) {
      const text = textOf(locale);
      expect(text).toContain("Alphadent Kft.");
      expect(text).toContain("9400 Sopron, Arany János u. 13.");
      expect(text).toContain("info@alpha-dent.eu");
      expect(text).toContain("08-09-017400");
      expect(text).toContain("14027493-2-08");
      expect(text).toContain("Guzsván Csaba");
      // Only the director's name: no birth date or private address on a public page.
      expect(text).not.toContain("Zerge");
      expect(text).not.toMatch(/\bnull\b|\bundefined\b/);
    }
  });

  it("megjeleníti a címet, a tartalomjegyzéket és minden szakaszt horgonnyal", () => {
    mockLocale = "hu";
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Adatkezelési tájékoztató");
    const toc = screen.getByRole("navigation", { name: "Tartalom" });
    const links = within(toc).getAllByRole("link");
    expect(links).toHaveLength(10);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it("az e-mail címeket és a honlapokat kattintható linkké alakítja", () => {
    mockLocale = "hu";
    render(<Page />);
    expect(screen.getAllByRole("link", { name: "info@alpha-dent.eu" })[0]).toHaveAttribute(
      "href",
      "mailto:info@alpha-dent.eu"
    );
    expect(screen.getByRole("link", { name: "ugyfelszolgalat@naih.hu" })).toHaveAttribute(
      "href",
      "mailto:ugyfelszolgalat@naih.hu"
    );
    expect(screen.getByRole("link", { name: "https://naih.hu" })).toHaveAttribute("target", "_blank");
  });

  it("idegen nyelven jelzi, hogy a magyar változat az irányadó", () => {
    mockLocale = "de";
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Datenschutzerklärung");
    expect(screen.getByText(/ungarische Fassung maßgeblich/)).toBeInTheDocument();
  });
});
