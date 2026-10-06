import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AutoGallery } from "../../components/ui/auto-gallery";
import { PhotoGrid } from "../../components/ui/photo-grid";

const IMAGES = [
  { src: "https://res.cloudinary.com/demo/image/upload/v1/a.webp", alt: "Kép A" },
  { src: "https://res.cloudinary.com/demo/image/upload/v1/b.webp", alt: "Kép B" },
];

describe("AutoGallery", () => {
  it("minden képet renderel, lazy betöltéssel és anonim CORS-szal (sütik nélkül)", () => {
    render(<AutoGallery images={IMAGES} />);
    const images = screen.getAllByRole("img", { name: "Kép A" });
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("crossorigin", "anonymous");
    }
  });

  it("a rövid listát legalább 8 képes hurokegységgé ismétli, és ezt duplázza a zökkenőmentes hurokhoz", () => {
    // 2 kép -> 4x ismételve = 8 képes egység, kétszer = 16 csempe.
    const { container } = render(<AutoGallery images={IMAGES} />);
    expect(container.querySelectorAll("img")).toHaveLength(16);
  });

  it("hosszú listát nem ismétel feleslegesen: csak a hurokhoz szükséges duplázás marad", () => {
    const many = Array.from({ length: 11 }, (_, index) => ({
      src: `https://res.cloudinary.com/demo/image/upload/v1/${index}.webp`,
      alt: `Kép ${index}`,
    }));
    const { container } = render(<AutoGallery images={many} />);
    expect(container.querySelectorAll("img")).toHaveLength(22);
  });

  it("minden kép csak egyszer érhető el (képernyőolvasó, Tab), az ismétlések aria-hidden-ek", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    const hiddenCopies = container.querySelectorAll('button[aria-hidden="true"]');
    expect(hiddenCopies).toHaveLength(16 - IMAGES.length);
    for (const copy of hiddenCopies) {
      expect(copy).toHaveAttribute("tabindex", "-1");
    }
  });

  it("kézi léptető gombokat renderel", () => {
    render(<AutoGallery images={IMAGES} />);
    expect(screen.getByRole("button", { name: "common.gallery.prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "common.gallery.next" })).toBeInTheDocument();
  });

  it("kattintásra megnyitja a képet a nagyítóban, ahol lapozni és bezárni is lehet", () => {
    render(<AutoGallery images={IMAGES} />);
    fireEvent.click(screen.getAllByRole("button", { name: "common.lightbox.open" })[0]);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("1 / 2")).toBeInTheDocument();
    const fullImage = within(dialog).getByRole("img", { name: "Kép A" });
    expect(fullImage).toHaveAttribute("crossorigin", "anonymous");
    expect(fullImage.getAttribute("src")).toContain("c_limit");

    fireEvent.click(within(dialog).getByRole("button", { name: "common.lightbox.next" }));
    expect(within(dialog).getByText("2 / 2")).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Kép B" })).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByText("1 / 2")).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(within(dialog).getByText("2 / 2")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "common.lightbox.close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("PhotoGrid", () => {
  it("a rácsból megnyitott kép a nagyítóban a rács összes képe között lapozható", () => {
    render(<PhotoGrid photos={IMAGES} />);
    fireEvent.click(screen.getAllByRole("button", { name: "common.lightbox.open" })[1]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("2 / 2")).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Kép B" })).toBeInTheDocument();
  });
});

describe("Lightbox nagyítás", () => {
  const openFirst = () => {
    render(<PhotoGrid photos={IMAGES} />);
    fireEvent.click(screen.getAllByRole("button", { name: "common.lightbox.open" })[0]);
    const dialog = screen.getByRole("dialog");
    return { dialog, image: () => within(dialog).getByRole("img") };
  };

  it("100%-on indul: a kicsinyítés és a visszaállítás tiltott, a nagyítás elérhető", () => {
    const { dialog, image } = openFirst();
    expect(within(dialog).getByRole("button", { name: "common.lightbox.zoomOut" })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "common.lightbox.resetZoom" })).toHaveTextContent("100%");
    expect(within(dialog).getByRole("button", { name: "common.lightbox.zoomIn" })).toBeEnabled();
    expect(image().style.transform).toContain("scale(1)");
  });

  it("a gombokkal nagyít és kicsinyít, legfeljebb 400%-ig", () => {
    const { dialog, image } = openFirst();
    const zoomIn = within(dialog).getByRole("button", { name: "common.lightbox.zoomIn" });
    fireEvent.click(zoomIn);
    expect(image().style.transform).toContain("scale(1.5)");
    expect(within(dialog).getByRole("button", { name: "common.lightbox.resetZoom" })).toHaveTextContent("150%");
    for (let i = 0; i < 5; i++) fireEvent.click(zoomIn);
    expect(image().style.transform).toContain("scale(4)");
    expect(zoomIn).toBeDisabled();
    fireEvent.click(within(dialog).getByRole("button", { name: "common.lightbox.zoomOut" }));
    expect(within(dialog).getByRole("button", { name: "common.lightbox.resetZoom" })).toHaveTextContent("267%");
  });

  it("billentyűzettel is működik (+, -, 0), és nagyításkor nagyobb felbontású képet kér", () => {
    const { dialog, image } = openFirst();
    fireEvent.keyDown(dialog, { key: "+" });
    expect(image().style.transform).toContain("scale(1.5)");
    expect(image()).toHaveAttribute("sizes", "150vw");
    fireEvent.keyDown(dialog, { key: "0" });
    expect(image().style.transform).toContain("scale(1)");
    expect(image()).toHaveAttribute("sizes", "100vw");
  });

  it("dupla kattintásra nagyít, újabbra visszaáll", () => {
    const { image } = openFirst();
    fireEvent.doubleClick(image());
    expect(image().style.transform).toContain("scale(2.5)");
    fireEvent.doubleClick(image());
    expect(image().style.transform).toContain("scale(1)");
  });

  it("lapozáskor a következő kép újra 100%-on jelenik meg", () => {
    const { dialog, image } = openFirst();
    fireEvent.keyDown(dialog, { key: "+" });
    fireEvent.click(within(dialog).getByRole("button", { name: "common.lightbox.next" }));
    expect(image().style.transform).toContain("scale(1)");
  });
});

