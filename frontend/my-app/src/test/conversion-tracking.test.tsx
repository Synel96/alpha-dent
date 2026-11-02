import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// What reaches Vercel Web Analytics: track(name, props) and inject().
const track = vi.fn();
vi.mock("@vercel/analytics", () => ({ inject: vi.fn(), track: (...args: unknown[]) => track(...args) }));

const openMailto = vi.fn();
let desktop = false;
vi.mock("../../lib/booking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../lib/booking")>()),
  openMailto: (href: string) => openMailto(href),
  isDesktopPointer: () => desktop,
}));

import "../../lib/i18n";
import { BookingDialogProvider, useBookingCta } from "../../components/ui/booking-dialog";
import { startAnalytics } from "../../lib/analytics";

function ServicePageButton() {
  const { href, onClick } = useBookingCta("service-page", "implantologia");
  return (
    <a href={href} onClick={onClick}>
      Időpontot kérek
    </a>
  );
}

const fillAndSubmit = () => {
  fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Telefonszám" }), { target: { value: "+36 30 123 4567" } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Elolvastam és elfogadom az adatkezelési tájékoztatót." }));
  fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
};

describe("Konverziómérés (Vercel Web Analytics egyedi események)", () => {
  beforeEach(() => {
    track.mockClear();
    desktop = false;
  });

  it("az időpontkérő megnyitását a forrással és a kezeléssel méri", () => {
    render(
      <BookingDialogProvider>
        <ServicePageButton />
      </BookingDialogProvider>
    );
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    expect(track).toHaveBeenCalledWith("Booking Open", { source: "service-page", service: "implantologia" });
  });

  it("mobilon a „Tovább a küldéshez” Booking Submit (mobile) esemény, és sem a név, sem a telefonszám nem kerül bele", () => {
    render(
      <BookingDialogProvider>
        <ServicePageButton />
      </BookingDialogProvider>
    );
    fillAndSubmit();
    expect(track).toHaveBeenCalledWith("Booking Submit", { device: "mobile" });
    const sent = JSON.stringify(track.mock.calls);
    expect(sent).not.toContain("Kiss Anna");
    expect(sent).not.toContain("123 4567");
  });

  it("számítógépen a választott csatornát is méri (levelező, Gmail, Outlook.com, másolás)", async () => {
    desktop = true;
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    render(
      <BookingDialogProvider>
        <ServicePageButton />
      </BookingDialogProvider>
    );
    fillAndSubmit();
    expect(track).toHaveBeenCalledWith("Booking Submit", { device: "desktop" });
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("link", { name: "Gmail" }));
    fireEvent.click(within(dialog).getByRole("link", { name: "Outlook.com" }));
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Levél szövegének másolása" }));
    });
    const channels = track.mock.calls.filter(([name]) => name === "Booking Channel").map(([, props]) => props.channel);
    expect(channels).toEqual(["gmail", "outlook", "copy"]);
  });

  it("a hívás- és e-mail-linkekre kattintást a helyükkel méri; az előre megírt időpontkérő levelet nem számolja e-mailnek", () => {
    startAnalytics();
    render(
      <div>
        <footer data-analytics-place="footer">
          <a href="tel:+36208080600">+36 20 80 80 600</a>
          <a href="mailto:info@alpha-dent.eu">info@alpha-dent.eu</a>
        </footer>
        <a href="mailto:info@alpha-dent.eu?subject=Id%C5%91pontk%C3%A9r%C3%A9s">előre megírt</a>
        <a href="tel:+3699788888">vezetékes</a>
      </div>
    );
    for (const name of ["+36 20 80 80 600", "info@alpha-dent.eu", "előre megírt", "vezetékes"]) {
      // Keep jsdom from trying to navigate to tel:/mailto:.
      const link = screen.getByRole("link", { name });
      link.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(link);
    }
    expect(track.mock.calls).toEqual([
      ["Call Click", { place: "footer" }],
      ["Email Click", { place: "footer" }],
      ["Call Click", { place: "other" }],
    ]);
  });
});
