import { fireEvent, render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AutoGallery } from "../../components/ui/auto-gallery";
import { PhotoGrid } from "../../components/ui/photo-grid";
import { RevealGroup } from "../../components/ui/reveal-section";

const IMAGES = [
  { src: "https://res.cloudinary.com/demo/image/upload/v1/a.webp", alt: "Kép A" },
  { src: "https://res.cloudinary.com/demo/image/upload/v1/b.webp", alt: "Kép B" },
];

describe("Kép skeleton", () => {
  it("a körhinta minden képe alatt skeleton van, ami a kép betöltése után eltűnik", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    const tiles = container.querySelectorAll("img").length;
    expect(container.querySelectorAll(".image-skeleton")).toHaveLength(tiles);

    const [first] = container.querySelectorAll("img");
    fireEvent.load(first);
    expect(container.querySelectorAll(".image-skeleton")).toHaveLength(tiles - 1);
  });

  it("a skeleton a kép előtt áll a DOM-ban, így a betöltött kép rárajzolódik (JS nélkül is látszik)", () => {
    const { container } = render(<PhotoGrid photos={IMAGES} />);
    const skeleton = container.querySelector(".image-skeleton");
    expect(skeleton?.nextElementSibling?.tagName).toBe("IMG");
    expect(skeleton?.nextElementSibling).not.toHaveClass("opacity-0");
  });

  it("hibás kép esetén sem marad örökre a skeleton", () => {
    const { container } = render(<PhotoGrid photos={IMAGES} />);
    fireEvent.error(container.querySelectorAll("img")[1]);
    expect(container.querySelectorAll(".image-skeleton")).toHaveLength(IMAGES.length - 1);
  });
});

describe("RevealGroup", () => {
  it("az első `skip` gyereket érintetlenül hagyja, a többit reveal-be csomagolja", () => {
    const { getByText } = render(
      <RevealGroup skip={1}>
        <h1>Cím</h1>
        {null}
        <p>Első szekció</p>
        <p>Második szekció</p>
      </RevealGroup>
    );
    expect(getByText("Cím").parentElement?.className ?? "").not.toContain("transition-[opacity,transform]");
    expect(getByText("Első szekció").parentElement).toHaveClass("transition-[opacity,transform]");
    expect(getByText("Második szekció").parentElement).toHaveClass("transition-[opacity,transform]");
  });

  it("az előre renderelt HTML-ben minden látszik, így JS nélkül sem üres az oldal", () => {
    const html = renderToString(
      <RevealGroup>
        <p>Szekció</p>
      </RevealGroup>
    );
    expect(html).toContain("opacity-100");
    expect(html).not.toContain("opacity-0");
  });

  it("JS-sel a hajtás alatti szekció rejtve vár, a képernyőn lévő látszik", () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    rect.mockImplementation(function (this: HTMLElement) {
      const top = this.textContent === "Lent" ? window.innerHeight + 500 : 100;
      return { top, bottom: top + 50, left: 0, right: 100, width: 100, height: 50, x: 0, y: top, toJSON: () => ({}) };
    });
    try {
      const { getByText } = render(
        <RevealGroup>
          <p>Fent</p>
          <p>Lent</p>
        </RevealGroup>
      );
      expect(getByText("Fent").parentElement).toHaveClass("opacity-100");
      expect(getByText("Lent").parentElement).toHaveClass("opacity-0");
    } finally {
      rect.mockRestore();
    }
  });
});
