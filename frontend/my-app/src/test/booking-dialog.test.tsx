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

  it("a név és a telefonszám külön kötelező mező, a sablonban nincs rájuk sor", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("textbox", { name: "Név" })).toBeRequired();
    expect(within(dialog).getByRole("textbox", { name: "Telefonszám" })).toBeRequired();
    const message = (within(dialog).getByRole("textbox", { name: "Üzenet" }) as HTMLTextAreaElement).value;
    expect(message).not.toContain("Név:");
    expect(message).not.toContain("Telefonszám:");
  });

  it("a „Tovább a küldéshez” a beírt tárggyal nyitja a levelezőt, az üzenet alján a névvel és a telefonszámmal", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Név" }), { target: { value: " Kiss Anna " } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Telefonszám" }), {
      target: { value: "+36 30 123 4567" },
    });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Tárgy" }), { target: { value: "Fogfájás" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Üzenet" }), {
      target: { value: "Holnap délelőtt jó lenne.\n" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Tovább a küldéshez" }));

    expect(openMailto).toHaveBeenCalledTimes(1);
    const href = openMailto.mock.calls[0][0] as string;
    expect(href.startsWith("mailto:info@alpha-dent.eu?")).toBe(true);
    expect(mailtoParams(href).get("subject")).toBe("Fogfájás");
    expect(mailtoParams(href).get("body")).toBe(
      "Holnap délelőtt jó lenne.\r\n\r\nKiss Anna\r\nTelefonszám: +36 30 123 4567"
    );
    // A short confirmation follows, with the same e-mail one tap away in
    // case no mail app opened; the fields keep their values.
    const confirmation = screen.getByRole("dialog", { name: "Megnyílt a levelezője?" });
    expect(within(confirmation).getByRole("link", { name: "Levelező megnyitása újra" })).toHaveAttribute("href", href);
    fireEvent.click(within(confirmation).getByRole("button", { name: "Vissza a szerkesztéshez" }));
    expect(screen.getByRole("textbox", { name: "Név" })).toHaveValue(" Kiss Anna ");
    expect(screen.getByRole("textbox", { name: "Tárgy" })).toHaveValue("Fogfájás");
  });

  it("a „Kész” gomb bezárja a modalt", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Telefonszám" }), { target: { value: "+36301234567" } });
    fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
    fireEvent.click(screen.getByRole("button", { name: "Kész" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
      expect(bookingResources[locale].booking.message, locale).toContain("{{service}}");
      const dialog = bookingResources[locale].booking.dialog;
      expect(Object.keys(dialog).sort(), locale).toEqual(keys);
      for (const value of Object.values(dialog)) expect(value, locale).not.toBe("");
    }
  });
});
