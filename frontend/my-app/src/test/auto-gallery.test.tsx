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

  it("a sávot duplázza a zökkenőmentes hurokhoz - a képek száma a duplája az eredetinek", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    expect(container.querySelectorAll("img")).toHaveLength(IMAGES.length * 2);
  });

  it("a másolt (ismétlődő) képek aria-hidden-ek és nem fókuszálhatók", () => {
    const { container } = render(<AutoGallery images={IMAGES} />);
    const hiddenCopies = container.querySelectorAll('button[aria-hidden="true"]');
    expect(hiddenCopies).toHaveLength(IMAGES.length);
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
