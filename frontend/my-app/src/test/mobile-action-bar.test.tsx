import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// The hero's scroll progress, driven by the test: 1 = no hero on the page
// (or scrolled past it), 0 = the hero fills the screen.
let heroProgress = 1;
const listeners = new Set<() => void>();
vi.mock("../../components/ui/hero", () => ({
  subscribeHeroProgress: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getHeroProgress: () => heroProgress,
  getHeroProgressServerSnapshot: () => 1,
}));
const setHeroProgress = (value: number) =>
  act(() => {
    heroProgress = value;
    listeners.forEach((listener) => listener());
  });

import "../../lib/i18n";
import { BookingDialogProvider } from "../../components/ui/booking-dialog";
import { MobileActionBar } from "../../components/ui/mobile-action-bar";

const renderBar = (hidden = false) =>
  render(
    <BookingDialogProvider>
      <MobileActionBar hidden={hidden} />
    </BookingDialogProvider>
  );
const bar = () => screen.getByTestId("mobile-action-bar");

describe("Mobil alsó sáv (Hívás + Időpontot kérek)", () => {
  beforeEach(() => {
    heroProgress = 1;
    listeners.clear();
  });

  it("csak mobilon látszik (md-től rejtett), és a képernyő aljára van rögzítve", () => {
    renderBar();
    expect(bar().className).toContain("md:hidden");
    expect(bar().className).toMatch(/\bfixed\b/);
    expect(bar().className).toContain("bottom-0");
  });

  it("nyitókép nélküli oldalon azonnal megjelenik, a Hívás a klinika számát hívja", () => {
    renderBar();
    expect(bar()).not.toHaveAttribute("aria-hidden");
    expect(bar().className).toContain("translate-y-0");
    expect(within(bar()).getByRole("link", { name: "Hívás" })).toHaveAttribute("href", "tel:+36208080600");
  });

  it("az „Időpontot kérek” az időpontkérő modalt nyitja", () => {
    renderBar();
    const link = within(bar()).getByRole("link", { name: "Időpontot kérek" });
    expect(link.getAttribute("href")).toMatch(/^mailto:info@alpha-dent\.eu\?subject=/);
    fireEvent.click(link);
    expect(screen.getByRole("dialog", { name: "Időpontkérés" })).toBeInTheDocument();
  });

  it("a nyitóképes oldalon csak akkor jelenik meg, ha a nyitókép (a saját gombjaival) már elgörgetett", () => {
    heroProgress = 0;
    renderBar();
    expect(bar()).toHaveAttribute("aria-hidden", "true");
    expect(bar().className).toContain("translate-y-full");
    setHeroProgress(0.5);
    expect(bar()).toHaveAttribute("aria-hidden", "true");
    setHeroProgress(0.9);
    expect(bar()).not.toHaveAttribute("aria-hidden");
    setHeroProgress(0.2);
    expect(bar()).toHaveAttribute("aria-hidden", "true");
  });

  it("nyitott menü mellett elrejtőzik, és rejtve nem fókuszálható (inert)", () => {
    renderBar(true);
    expect(bar()).toHaveAttribute("aria-hidden", "true");
    expect(bar()).toHaveAttribute("inert");
  });
});
