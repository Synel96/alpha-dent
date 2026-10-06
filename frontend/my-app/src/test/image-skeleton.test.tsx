import { fireEvent, render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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
    expect(getByText("Cím").parentElement?.className ?? "").not.toContain("opacity-0");
    expect(getByText("Első szekció").parentElement).toHaveClass("opacity-0");
    expect(getByText("Második szekció").parentElement).toHaveClass("opacity-0");
  });
});
