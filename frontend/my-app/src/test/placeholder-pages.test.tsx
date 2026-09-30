import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

type ReturnObjectsOptions = { returnObjects?: boolean };

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: ReturnObjectsOptions) => {
      if (!options?.returnObjects) return key;
      if (key === "clinicPage.highlights") {
        return [
          { value: "1996", label: "highlight-0" },
          { value: "15", label: "highlight-1" },
        ];
      }
      return [`${key}-0`, `${key}-1`];
    },
  }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { Page as KlinikankPage } from "../../pages/klinikank/+Page";

describe("Klinikánk oldal", () => {
  it("megjeleníti a címet és a kiemelt tényeket", () => {
    render(<KlinikankPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("clinicPage.title");
    expect(screen.getByText("1996")).toBeInTheDocument();
    expect(screen.getByText("highlight-1")).toBeInTheDocument();
  });

  it("megjeleníti a rendelő, labor, labormunkák és implantológia szekciókat", () => {
    render(<KlinikankPage />);
    for (const section of ["rooms", "lab", "work", "implants"]) {
      expect(screen.getByRole("heading", { name: `clinicPage.${section}.title` })).toBeInTheDocument();
      expect(screen.getByText(`clinicPage.${section}.paragraphs-0`)).toBeInTheDocument();
    }
  });

  it("a rendelő képeit és az időpontkérő gombot a magyar kapcsolat oldalra mutatva jeleníti meg", () => {
    render(<KlinikankPage />);
    expect(screen.getByRole("img", { name: "clinicPage.rooms.panoramaAlt" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "clinicPage.rooms.waitingRoomAlt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.intro.ctaButton" })).toHaveAttribute("href", "/hu/kapcsolat");
  });
});
