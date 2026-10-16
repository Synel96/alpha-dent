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
import { GALLERY_SECTIONS } from "../../lib/gallery";

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

  it("a rendelő képeit (panorámával együtt) körhintában és az időpontkérő gombot a kapcsolat oldalra mutatva jeleníti meg", () => {
    render(<KlinikankPage />);
    // Each photo is exposed once, even though the carousel repeats short lists.
    expect(screen.getAllByRole("img", { name: "clinicPage.rooms.photos.panorama" })).toHaveLength(1);
    expect(screen.getAllByRole("img", { name: "clinicPage.rooms.photos.waitingRoom" })).toHaveLength(1);
    // In the order the clinic chose: entrance first, the building last.
    const roomPhotos = screen
      .getAllByRole("img", { name: /^clinicPage\.rooms\.photos\./ })
      .map((img) => img.getAttribute("alt"));
    expect(roomPhotos[0]).toBe("clinicPage.rooms.photos.entrance");
    expect(roomPhotos).toHaveLength(10);
    expect(roomPhotos[9]).toBe("clinicPage.rooms.photos.building");
    expect(screen.getByRole("link", { name: /home\.intro\.ctaButton/ })).toHaveAttribute("href", "/hu/kapcsolat");
  });

  it("a labormunkák szekcióban körhintán mutatja a labor képeit", () => {
    render(<KlinikankPage />);
    const labPhotos = GALLERY_SECTIONS.find((section) => section.key === "lab")!.photos;
    expect(labPhotos.length).toBeGreaterThan(0);
    // The Galéria lab photos, each with its own alt text, first one first.
    expect(screen.getAllByRole("img", { name: /^galleryPage\.photos\./ })).toHaveLength(labPhotos.length);
    expect(screen.getAllByRole("img", { name: /^galleryPage\.photos\./ })[0]).toHaveAttribute("alt", labPhotos[0].altKey);
  });
});
