import { useState } from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  PushDrawer,
  PushDrawerBody,
  PushDrawerContent,
  PushDrawerTitle,
  PushDrawerTrigger,
} from "../../components/ui/push-drawer";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <PushDrawer open={open} onOpenChange={setOpen}>
      <PushDrawerBody open={open} className="page-body">
        <PushDrawerTrigger>Menü megnyitása</PushDrawerTrigger>
        <p>Oldal tartalma</p>
      </PushDrawerBody>
      <PushDrawerContent open={open} aria-describedby={undefined}>
        <PushDrawerTitle>Navigáció</PushDrawerTitle>
        <a href="/kapcsolat">Kapcsolat</a>
      </PushDrawerContent>
    </PushDrawer>
  );
}

describe("PushDrawer", () => {
  it("kezdetben zárva jelenik meg: a panel a képernyőn kívül van, az oldal nincs eltolva", () => {
    const { container } = render(<Harness />);

    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.style.transform).toContain("translateX(100%)");

    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("translateX(0) scale(1)");
  });

  it("megnyitáskor a panel a helyére csúszik, az oldal pedig pontosan a panel szélességével eltolódik", () => {
    const { container, getByText } = render(<Harness />);

    fireEvent.click(getByText("Menü megnyitása"));

    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.style.transform).toBe("translateX(0) rotateY(0deg)");

    // jsdom's default window.innerWidth is 1024, so the panel's own
    // min(75vw, 24rem) width formula caps out at 384px.
    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("translateX(-384px) scale(0.97)");
  });

  it("a háttér (scrim) kattintására bezáródik, és az oldal visszaáll", () => {
    const { container, getByText } = render(<Harness />);

    fireEvent.click(getByText("Menü megnyitása"));
    const scrim = document.body.querySelector(".z-40") as HTMLElement;
    fireEvent.click(scrim);

    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.style.transform).toContain("translateX(100%)");

    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("translateX(0) scale(1)");
  });

  it("zárva a panel inert és nem fogadja a kattintást, a scrim pointer-events-none", () => {
    const { container } = render(<Harness />);

    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel).toHaveAttribute("inert");

    const scrim = document.body.querySelector(".z-40") as HTMLElement;
    expect(scrim.className).toContain("pointer-events-none");
  });
});
