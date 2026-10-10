import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => (options?.count !== undefined ? `${key}:${options.count}` : key),
  }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

const sections = vi.hoisted(() => ({
  value: [] as Array<{ key: "clinic" | "lab"; photos: Array<{ src: string; altKey: string }> }>,
}));
vi.mock("../../lib/gallery", () => ({
  get GALLERY_SECTIONS() {
    return sections.value;
  },
}));

import { Page } from "../../pages/galeria/+Page";

describe("Galéria oldal", () => {
  beforeEach(() => {
    sections.value = [
      { key: "clinic", photos: [] },
      { key: "lab", photos: [] },
    ];
  });

  it("egy H1 címsora van", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("galleryPage.title");
  });

  it("képek nélkül nem mutat üres szekciókat, hanem egy 'hamarosan' üzenetet a Klinikánk oldalra mutató gombbal", () => {
    render(<Page />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByText("galleryPage.comingSoon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nav\.clinic/ })).toHaveAttribute("href", "/hu/klinikank");
  });

  it("csak azokat a szekciókat mutatja, amelyekben van kép, a képek számával és nagyítható képekkel", () => {
    sections.value = [
      { key: "clinic", photos: [] },
      {
        key: "lab",
        photos: [
          { src: "https://res.cloudinary.com/demo/image/upload/v1/a.webp", altKey: "alt.a" },
          { src: "https://res.cloudinary.com/demo/image/upload/v1/b.webp", altKey: "alt.b" },
        ],
      },
    ];
    render(<Page />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual(["galleryPage.sections.lab.title"]);
    expect(screen.getByText("galleryPage.photoCount:2")).toBeInTheDocument();
    const section = headings[0].closest("section")!;
    expect(within(section).getByRole("img", { name: "alt.a" })).toHaveAttribute("loading", "lazy");
    expect(within(section).getAllByRole("button", { name: /common\.lightbox\.open/ })).toHaveLength(2);
    expect(screen.queryByText("galleryPage.comingSoon")).not.toBeInTheDocument();
  });
});
