import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { ServiceCarousel } from "../../components/ui/service-carousel";

describe("ServiceCarousel", () => {
  const originalScrollBy = Element.prototype.scrollBy;

  afterEach(() => {
    Element.prototype.scrollBy = originalScrollBy;
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

  it("a nyíl gombokon a lokalizált címkéket használja", () => {
    render(
      <ServiceCarousel>
        <div>Kártya</div>
      </ServiceCarousel>
    );
    expect(screen.getByRole("button", { name: "common.carousel.prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "common.carousel.next" })).toBeInTheDocument();
  });

  it("a következő/előző gombok a görgethető konténert görgetik, ellentétes irányba", () => {
    const scrollBySpy = vi.fn();
    Element.prototype.scrollBy = scrollBySpy;

    render(
      <ServiceCarousel>
        <div>Kártya 1</div>
        <div>Kártya 2</div>
      </ServiceCarousel>
    );

    fireEvent.click(screen.getByRole("button", { name: "common.carousel.next" }));
    expect(scrollBySpy).toHaveBeenCalledTimes(1);
    const nextArgs = scrollBySpy.mock.calls.at(-1)?.[0];
    expect(nextArgs.left).toBeGreaterThan(0);
    expect(nextArgs.behavior).toBe("smooth");

    fireEvent.click(screen.getByRole("button", { name: "common.carousel.prev" }));
    expect(scrollBySpy).toHaveBeenCalledTimes(2);
    const prevArgs = scrollBySpy.mock.calls.at(-1)?.[0];
    expect(prevArgs.left).toBeLessThan(0);
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
