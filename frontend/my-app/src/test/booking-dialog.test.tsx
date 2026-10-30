import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const openMailto = vi.fn();
vi.mock("../../lib/booking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../lib/booking")>()),
  openMailto: (href: string) => openMailto(href),
}));

import "../../lib/i18n";
import { BookingDialogProvider, useBookingCta } from "../../components/ui/booking-dialog";
import type { ServiceSlug } from "../../lib/service-cards";

function BookingLink({ service }: { service?: ServiceSlug }) {
  const { href, onClick } = useBookingCta(service);
  return (
    <a href={href} onClick={onClick}>
      Időpontot kérek
    </a>
  );
}

const renderWithProvider = (service?: ServiceSlug) =>
  render(
    <BookingDialogProvider>
      <BookingLink service={service} />
    </BookingDialogProvider>
  );

const mailtoParams = (href: string) => new URLSearchParams(href.slice(href.indexOf("?") + 1));

describe("Időpontkérő modal", () => {
  beforeEach(() => openMailto.mockClear());

  it("a gomb a modalt nyitja, előre kitöltött tárggyal és üzenettel (a szolgáltatással)", () => {
    renderWithProvider("implantologia");
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));

    const dialog = screen.getByRole("dialog", { name: "Időpontkérés" });
    expect(within(dialog).getByRole("textbox", { name: "Tárgy" })).toHaveValue("Időpontkérés");
    expect((within(dialog).getByRole("textbox", { name: "Üzenet" }) as HTMLTextAreaElement).value).toContain(
      "Kezelés: Implantológia"
    );
  });

  it("a „Tovább a küldéshez” a beírt tárggyal és üzenettel nyitja a levelezőt, a modal nyitva marad (ha nem nyílna meg a levelező)", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Tárgy" }), { target: { value: "Fogfájás" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Üzenet" }), {
      target: { value: "Holnap délelőtt jó lenne.\nKiss Anna" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Tovább a küldéshez" }));

    expect(openMailto).toHaveBeenCalledTimes(1);
    const href = openMailto.mock.calls[0][0] as string;
    expect(href.startsWith("mailto:info@alpha-dent.eu?")).toBe(true);
    expect(mailtoParams(href).get("subject")).toBe("Fogfájás");
    expect(mailtoParams(href).get("body")).toBe("Holnap délelőtt jó lenne.\r\nKiss Anna");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("újranyitáskor a sablonnal indul, nem az előző szöveggel", () => {
    renderWithProvider();
    const link = screen.getByRole("link", { name: "Időpontot kérek" });
    fireEvent.click(link);
    fireEvent.change(screen.getByRole("textbox", { name: "Tárgy" }), { target: { value: "Más" } });
    fireEvent.click(screen.getByRole("button", { name: "Bezárás" }));
    fireEvent.click(link);
    expect(screen.getByRole("textbox", { name: "Tárgy" })).toHaveValue("Időpontkérés");
  });

  it("módosító billentyűvel (pl. új lap) nem nyit modalt; a link maga is mailto", () => {
    renderWithProvider();
    const link = screen.getByRole("link", { name: "Időpontot kérek" });
    expect(link.getAttribute("href")).toMatch(/^mailto:info@alpha-dent\.eu\?subject=/);
    fireEvent.click(link, { ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("minden nyelven megvannak a modal szövegei", async () => {
    const { bookingResources } = await import("../../lib/i18n/booking");
    const keys = Object.keys(bookingResources.hu.booking.dialog).sort();
    for (const locale of ["en", "de", "it"] as const) {
      const dialog = bookingResources[locale].booking.dialog;
      expect(Object.keys(dialog).sort(), locale).toEqual(keys);
      for (const value of Object.values(dialog)) expect(value, locale).not.toBe("");
    }
  });
});
