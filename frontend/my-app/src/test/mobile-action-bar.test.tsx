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
const handle = () => screen.getByTestId("mobile-action-bar-handle");
const isShown = (element: HTMLElement) => element.getAttribute("aria-hidden") === null;
const expand = () => fireEvent.click(screen.getByRole("button", { name: "Hívás és időpontkérés megjelenítése" }));

describe("Mobil alsó sáv (Hívás + Időpontot kérek)", () => {
  beforeEach(() => {
    heroProgress = 1;
    listeners.clear();
    window.sessionStorage.clear();
  });

  it("csak mobilon látszik (md-től rejtett), és a képernyő aljára van rögzítve", () => {
    renderBar();
    for (const element of [bar(), handle()]) {
      expect(element.className).toContain("md:hidden");
      expect(element.className).toMatch(/\bfixed\b/);
    }
    expect(bar().className).toContain("bottom-0");
  });

  it("alapból csak a naptár gomb látszik a sarokban, a sáv össze van csukva", () => {
    renderBar();
    expect(isShown(handle())).toBe(true);
    expect(isShown(bar())).toBe(false);
    expect(bar().className).toContain("translate-y-full");
    expect(bar()).toHaveAttribute("inert");
  });

  it("a naptár gomb kinyitja a sávot; a Hívás a klinika számát hívja", () => {
    renderBar();
    expand();
    expect(isShown(bar())).toBe(true);
    expect(isShown(handle())).toBe(false);
    expect(bar().className).toContain("translate-y-0");
    expect(within(bar()).getByRole("link", { name: "Hívás" })).toHaveAttribute("href", "tel:+36208080600");
  });

  it("kinyitva az „Időpontot kérek” az időpontkérő modalt nyitja", () => {
    renderBar();
    expand();
    const link = within(bar()).getByRole("link", { name: "Időpontot kérek" });
    expect(link.getAttribute("href")).toMatch(/^mailto:info@alpha-dent\.eu\?subject=/);
    fireEvent.click(link);
    expect(screen.getByRole("dialog", { name: "Időpontkérés" })).toBeInTheDocument();
  });

  it("a sáv újra összecsukható, és a fókusz a naptár gombra kerül", () => {
    renderBar();
    expand();
    expect(screen.getByRole("button", { name: "A sáv elrejtése" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "A sáv elrejtése" }));
    expect(isShown(bar())).toBe(false);
    expect(isShown(handle())).toBe(true);
    expect(handle()).toHaveFocus();
  });

  it("megjegyzi a választást a látogatás végéig: kinyitva nyitva marad, összecsukva csukva (más oldalon is)", () => {
    const first = renderBar();
    expand();
    first.unmount();
    const second = renderBar(); // the next page
    expect(isShown(bar())).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "A sáv elrejtése" }));
    second.unmount();
    renderBar();
    expect(isShown(bar())).toBe(false);
    expect(isShown(handle())).toBe(true);
  });

  it("nyitóképes oldalon a nyitókép elgörgetéséig se a sáv, se a naptár gomb nem látszik", () => {
    window.sessionStorage.setItem("alphadent:actionBarCollapsed", "0");
    heroProgress = 0;
    renderBar();
    expect(isShown(bar())).toBe(false);
    expect(isShown(handle())).toBe(false);
    setHeroProgress(0.5);
    expect(isShown(bar())).toBe(false);
    setHeroProgress(0.9);
    expect(isShown(bar())).toBe(true);
    setHeroProgress(0.2);
    expect(isShown(bar())).toBe(false);
  });

  it("nyitott menü mellett egyik sem látszik, és rejtve nem fókuszálható", () => {
    renderBar(true);
    expect(isShown(bar())).toBe(false);
    expect(bar()).toHaveAttribute("inert");
    expect(isShown(handle())).toBe(false);
    expect(handle()).toHaveAttribute("tabindex", "-1");
  });
});
