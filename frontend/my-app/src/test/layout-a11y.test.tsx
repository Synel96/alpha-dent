import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu", urlPathname: "/hu" }),
}));
vi.mock("vike/client/router", () => ({ navigate: vi.fn() }));
vi.mock("../../lib/analytics", () => ({ startAnalytics: vi.fn() }));

import { Layout } from "../../pages/+Layout";

describe("Akadálymentesség a fő elrendezésben", () => {
  it("az első fókuszálható elem az „Ugrás a tartalomra” link, ami a fő tartalomra mutat", async () => {
    render(
      <Layout>
        <p>Oldal tartalma</p>
      </Layout>
    );
    const focusable = () =>
      [...document.querySelectorAll<HTMLElement>("a[href], button, [tabindex]")].filter(
        (element) => element.tabIndex >= 0 && !element.closest("[inert]") && element.getAttribute("aria-hidden") !== "true"
      );
    const skip = screen.getByRole("link", { name: "Ugrás a tartalomra" });
    // The guards are taken out of the tab order as they appear (a
    // MutationObserver, so asynchronously).
    await waitFor(() => expect(focusable()[0]).toBe(skip));
    expect(skip).toHaveAttribute("href", "#main-content");

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    // Focusable from script (the link's target), but not a Tab stop of its own.
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveTextContent("Oldal tartalma");
  });

  it("zárt menünél a Radix láthatatlan fókuszőrei nincsenek a Tab-sorrendben, nyitottnál igen", async () => {
    render(
      <Layout>
        <p>Oldal tartalma</p>
      </Layout>
    );
    const guards = () => [...document.querySelectorAll<HTMLElement>("[data-radix-focus-guard]")];
    expect(guards().length).toBeGreaterThan(0);
    await waitFor(() => guards().forEach((guard) => expect(guard.tabIndex).toBe(-1)));

    fireEvent.click(screen.getByRole("button", { name: "Menü megnyitása" }));
    await waitFor(() => guards().forEach((guard) => expect(guard.tabIndex).toBe(0)));
  });
});
