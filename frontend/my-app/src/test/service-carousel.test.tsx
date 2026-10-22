import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { ServiceCarousel } from "../../components/ui/service-carousel";

describe("ServiceCarousel", () => {
  const originalScrollTo = Element.prototype.scrollTo;

  afterEach(() => {
    Element.prototype.scrollTo = originalScrollTo;
  });

  it("megjeleníti az összes átadott kártyát", () => {
    render(
      <ServiceCarousel>
        <div>Kártya 1</div>
        <div>Kártya 2</div>
      </ServiceCarousel>
    );
    expect(screen.getByText("Kártya 1")).toBeInTheDocument();
    expect(screen.getByText("Kártya 2")).toBeInTheDocument();
  });

  it("egyetlen kártyánál nincs mit lapozni, így nincsenek lapozó gombok", () => {
    render(
      <ServiceCarousel>
        <div>Kártya</div>
      </ServiceCarousel>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("a nyíl gombokon a lokalizált címkéket használja", () => {
    render(
      <ServiceCarousel>
        <div>Kártya 1</div>
        <div>Kártya 2</div>
      </ServiceCarousel>
    );
    expect(screen.getByRole("button", { name: "common.carousel.prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "common.carousel.next" })).toBeInTheDocument();
  });

  it("a nyilak és a pöttyök egész kártyára lapoznak, a sor végén a megfelelő nyíl inaktív", () => {
    const scrollToSpy = vi.fn();
    Element.prototype.scrollTo = scrollToSpy as typeof Element.prototype.scrollTo;

    render(
      <ServiceCarousel>
        <div>Kártya 1</div>
        <div>Kártya 2</div>
      </ServiceCarousel>
    );
    const row = screen.getByText("Kártya 1").parentElement!;
    // jsdom has no layout: give the cards and the row their geometry.
    Object.defineProperty(screen.getByText("Kártya 2"), "offsetLeft", { value: 300 });
    Object.defineProperty(row, "scrollWidth", { value: 600 });
    Object.defineProperty(row, "clientWidth", { value: 300 });
    let scrollLeft = 0;
    Object.defineProperty(row, "scrollLeft", { get: () => scrollLeft });
    fireEvent.scroll(row);

    const prev = screen.getByRole("button", { name: "common.carousel.prev" });
    const next = screen.getByRole("button", { name: "common.carousel.next" });
    const dots = screen.getAllByRole("button", { name: "common.carousel.goTo" });
    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(prev).toBeDisabled();

    fireEvent.click(next);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: 300, behavior: "smooth" });

    // The row has scrolled to its end.
    scrollLeft = 300;
    fireEvent.scroll(row);
    expect(dots[1]).toHaveAttribute("aria-current", "true");
    expect(next).toBeDisabled();
    expect(prev).toBeEnabled();

    fireEvent.click(prev);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: 0, behavior: "smooth" });
    fireEvent.click(dots[1]);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: 300, behavior: "smooth" });
  });

  describe("egérrel (asztali nézet)", () => {
    const setPointerCapture = vi.fn();
    const originalSet = Element.prototype.setPointerCapture;
    const originalHas = Element.prototype.hasPointerCapture;

    afterEach(() => {
      Element.prototype.setPointerCapture = originalSet;
      Element.prototype.hasPointerCapture = originalHas;
      setPointerCapture.mockReset();
    });

    const renderWithLink = () => {
      Element.prototype.setPointerCapture = setPointerCapture;
      Element.prototype.hasPointerCapture = () => false;
      render(
        <ServiceCarousel>
          <a href="/hu/szolgaltatasaink/implantologia">Implantológia</a>
        </ServiceCarousel>
      );
      const link = screen.getByRole("link", { name: "Implantológia" });
      return { link, row: link.parentElement! };
    };

    it("sima kattintásra nem foglalja le az egeret, így a csempe linkje megkapja a kattintást", () => {
      const { link } = renderWithLink();
      fireEvent.pointerDown(link, { pointerType: "mouse", pointerId: 1, button: 0, clientX: 100 });
      fireEvent.pointerUp(link, { pointerType: "mouse", pointerId: 1, clientX: 101 });
      expect(setPointerCapture).not.toHaveBeenCalled();
      // fireEvent returns false when the event's default action was prevented.
      expect(fireEvent.click(link)).toBe(true);
    });

    it("valódi húzás után lefoglalja az egeret, és a húzást lezáró kattintás nem nyitja meg a csempét", () => {
      const { link } = renderWithLink();
      fireEvent.pointerDown(link, { pointerType: "mouse", pointerId: 1, button: 0, clientX: 300 });
      fireEvent.pointerMove(link, { pointerType: "mouse", pointerId: 1, clientX: 200 });
      expect(setPointerCapture).toHaveBeenCalledWith(1);
      fireEvent.pointerUp(link, { pointerType: "mouse", pointerId: 1, clientX: 200 });
      expect(fireEvent.click(link)).toBe(false);
    });

    it("letiltja a böngésző saját link/kép húzását, ami megszakítaná a görgetést", () => {
      const { link } = renderWithLink();
      expect(fireEvent.dragStart(link)).toBe(false);
    });
  });
});
