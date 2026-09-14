import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AutoGallery } from "../../components/ui/auto-gallery";

const IMAGES = [
  { src: "https://res.cloudinary.com/demo/image/upload/v1/a.webp", alt: "Kép A" },
  { src: "https://res.cloudinary.com/demo/image/upload/v1/b.webp", alt: "Kép B" },
];

describe("AutoGallery", () => {
  it("minden képet renderel, lazy betöltéssel", () => {
    render(<AutoGallery images={IMAGES} />);
    const images = screen.getAllByRole("img", { name: "Kép A" });
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img).toHaveAttribute("loading", "lazy");
    }
  });

  it("a sávot duplázza a zökkenőmentes hurokhoz - a képek száma a duplája az eredetinek", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    expect(container.querySelectorAll("img")).toHaveLength(IMAGES.length * 2);
  });

  it("a másolt (ismétlődő) képek aria-hidden-ek, hogy ne duplázzák a képernyőolvasó tartalmát", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    const hiddenWrappers = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenWrappers).toHaveLength(IMAGES.length);
  });
});
