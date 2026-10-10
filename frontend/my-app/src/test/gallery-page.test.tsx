import { fireEvent, render, screen, within } from "@testing-library/react";
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
    // A single category needs no tabs.
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  describe("két kategóriával", () => {
    const photo = (name: string) => ({ src: `https://res.cloudinary.com/demo/image/upload/v1/${name}.webp`, altKey: `alt.${name}` });

    beforeEach(() => {
      sections.value = [
        { key: "clinic", photos: [photo("c1"), photo("c2"), photo("c3")] },
        { key: "lab", photos: [photo("l1"), photo("l2")] },
      ];
      window.history.replaceState(null, "", "/");
    });

    it("füleket mutat a képek számával, alapból a rendelő fül nyitva", () => {
      render(<Page />);
      const tabs = within(screen.getByRole("tablist", { name: "galleryPage.tabsLabel" })).getAllByRole("tab");
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[0]).toHaveTextContent("galleryPage.photoCount:3");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName(/galleryPage\.sections\.clinic\.title/);
      expect(screen.getByRole("img", { name: "alt.c1" })).toBeVisible();
      expect(screen.getByRole("img", { hidden: true, name: "alt.l1" })).not.toBeVisible();
    });

    it("kattintásra vált, és a hash-be írja a kategóriát", () => {
      render(<Page />);
      fireEvent.click(screen.getByRole("tab", { name: /galleryPage\.sections\.lab\.title/ }));
      expect(screen.getByRole("tab", { name: /lab\.title/ })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("img", { name: "alt.l1" })).toBeVisible();
      expect(window.location.hash).toBe("#labor");
    });

    it("nyilakkal is lapozható a fülek között", () => {
      render(<Page />);
      const clinicTab = screen.getByRole("tab", { name: /clinic\.title/ });
      fireEvent.keyDown(clinicTab, { key: "ArrowRight" });
      const labTab = screen.getByRole("tab", { name: /lab\.title/ });
      expect(labTab).toHaveAttribute("aria-selected", "true");
      expect(labTab).toHaveFocus();
      expect(labTab).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("tab", { name: /clinic\.title/ })).toHaveAttribute("tabindex", "-1");
    });

    it("a #labor hash-sel érkezve a labor fül nyílik meg", () => {
      window.history.replaceState(null, "", "/#labor");
      render(<Page />);
      expect(screen.getByRole("tab", { name: /lab\.title/ })).toHaveAttribute("aria-selected", "true");
    });
  });
});
