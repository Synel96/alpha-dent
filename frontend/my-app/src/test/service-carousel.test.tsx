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
});
