import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const openMailto = vi.fn();
// Phone by default (jsdom has no fine pointer); the computer tests flip it.
let desktop = false;
vi.mock("../../lib/booking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../lib/booking")>()),
  openMailto: (href: string) => openMailto(href),
  isDesktopPointer: () => desktop,
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

const PRIVACY_CHECKBOX = { name: "Elolvastam és elfogadom az adatkezelési tájékoztatót." };
const acceptPrivacy = () => fireEvent.click(screen.getByRole("checkbox", PRIVACY_CHECKBOX));

const mailtoParams = (href: string) => new URLSearchParams(href.slice(href.indexOf("?") + 1));

describe("Időpontkérő modal", () => {
  beforeEach(() => {
    openMailto.mockClear();
    desktop = false;
  });

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
    acceptPrivacy();
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

  it("ha kiveszi a pipát, a név és a telefonszám nem kerül a levélbe, és nem kötelező", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    const checkbox = within(dialog).getByRole("checkbox", { name: "Név és telefonszám beillesztése az üzenet végére" });
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(within(dialog).getByRole("textbox", { name: "Név" })).not.toBeRequired();
    expect(within(dialog).getByRole("textbox", { name: "Telefonszám" })).not.toBeRequired();
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Üzenet" }), { target: { value: "Csak az üzenet." } });
    acceptPrivacy();
    fireEvent.click(within(dialog).getByRole("button", { name: "Tovább a küldéshez" }));

    expect(mailtoParams(openMailto.mock.calls[0][0] as string).get("body")).toBe("Csak az üzenet.");
  });

  it("az „Alap üzenet törlése” kiüríti az üzenetet egyedi levélhez, és vissza is állítható", () => {
    renderWithProvider("implantologia");
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    const message = within(dialog).getByRole("textbox", { name: "Üzenet" }) as HTMLTextAreaElement;
    const template = message.value;

    fireEvent.click(within(dialog).getByRole("button", { name: "Alap üzenet törlése" }));
    expect(message).toHaveValue("");
    expect(message).toHaveFocus();

    fireEvent.change(message, { target: { value: "Saját levél" } });
    expect(within(dialog).getByRole("button", { name: "Üzenet törlése" })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Üzenet törlése" }));
    expect(message).toHaveValue("");

    fireEvent.click(within(dialog).getByRole("button", { name: "Alap üzenet visszaállítása" }));
    expect(message).toHaveValue(template);
    expect(template).toContain("Kezelés: Implantológia");
  });

  it("küldéskor a levelező megnyitása előtt leveszi a fókuszt a mezőről (mobilon bezárul a billentyűzet)", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    const phone = screen.getByRole("textbox", { name: "Telefonszám" });
    fireEvent.change(phone, { target: { value: "+36301234567" } });
    acceptPrivacy();
    phone.focus();
    expect(phone).toHaveFocus();
    // What has focus at the moment the mail app is opened - by then the
    // field must have let go of it (the form itself only goes afterwards).
    let focusedWhenOpened: Element | null = null;
    openMailto.mockImplementationOnce(() => (focusedWhenOpened = document.activeElement));
    // Submitting from the keyboard ("Enter" in the phone field).
    fireEvent.submit(phone.closest("form")!);
    expect(openMailto).toHaveBeenCalledTimes(1);
    expect(focusedWhenOpened).not.toBe(phone);
  });

  it("a háttér nincs elmosva (backdrop-filter), és a panel a görgethető rétegben van, nem fixen középre igazítva", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement!;
    expect(overlay.className).toContain("overflow-y-auto");
    expect(overlay.className).toContain("fixed");
    expect(overlay.className).not.toMatch(/backdrop-blur/);
    expect(dialog.className).not.toMatch(/\bfixed\b|translate/);
  });

  it("magas modal alacsony ablakban is a tetejétől görgethető (my-auto, nem items-center), és nem görgeti tovább az oldalt", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement!;
    // items-center would push a too-tall panel's top out of reach.
    expect(overlay.className).not.toMatch(/items-center/);
    expect(overlay.className).toContain("items-start");
    expect(dialog.className).toContain("my-auto");
    expect(overlay.className).toContain("overscroll-contain");
  });

  it("az adatkezelési tájékoztató elfogadása kötelező: nélküle nem nyílik meg a levelező", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Telefonszám" }), { target: { value: "+36301234567" } });
    const checkbox = screen.getByRole("checkbox", PRIVACY_CHECKBOX);
    expect(checkbox).toBeRequired();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
    expect(openMailto).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Időpontkérés" })).toBeInTheDocument();

    acceptPrivacy();
    fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
    expect(openMailto).toHaveBeenCalledTimes(1);
  });

  it("a tájékoztató linkje az aktuális nyelvű oldalra mutat, új lapon (a kitöltött modal megmarad)", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    const link = screen.getByRole("link", { name: "adatkezelési tájékoztatót" });
    expect(link).toHaveAttribute("href", "/hu/adatkezelesi-tajekoztato");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("a „Kész” gomb bezárja a modalt", () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Telefonszám" }), { target: { value: "+36301234567" } });
    acceptPrivacy();
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

describe("Időpontkérő modal számítógépen", () => {
  beforeEach(() => {
    openMailto.mockClear();
    desktop = true;
  });

  const fillAndSubmit = () => {
    renderWithProvider("implantologia");
    fireEvent.click(screen.getByRole("link", { name: "Időpontot kérek" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Név" }), { target: { value: "Kiss Anna" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Telefonszám" }), { target: { value: "+36 30 123 4567" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Üzenet" }), { target: { value: "Jövő héten jó lenne." } });
    acceptPrivacy();
    fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
    return screen.getByRole("dialog", { name: "Hogyan küldi el a levelet?" });
  };
  const expectedBody = "Jövő héten jó lenne.\r\n\r\nKiss Anna\r\nTelefonszám: +36 30 123 4567";

  it("nem nyitja meg vakon a levelezőt, hanem megkérdezi, hogyan küldje el", () => {
    const dialog = fillAndSubmit();
    expect(openMailto).not.toHaveBeenCalled();
    const mailApp = within(dialog).getByRole("link", { name: "Levelezőprogram (Outlook, Apple Mail…)" });
    expect(mailtoParams(mailApp.getAttribute("href")!).get("body")).toBe(expectedBody);
    expect(within(dialog).getByText("info@alpha-dent.eu", { selector: "dd" })).toBeInTheDocument();
    expect(within(dialog).getByText("Időpontkérés", { selector: "dd" })).toBeInTheDocument();
  });

  it("a Gmail és az Outlook.com gomb új lapon, kitöltött levéllel nyílik", () => {
    const dialog = fillAndSubmit();
    const gmail = within(dialog).getByRole("link", { name: "Gmail" });
    expect(gmail).toHaveAttribute("target", "_blank");
    const gmailUrl = new URL(gmail.getAttribute("href")!);
    expect(gmailUrl.origin).toBe("https://mail.google.com");
    expect(gmailUrl.searchParams.get("to")).toBe("info@alpha-dent.eu");
    expect(gmailUrl.searchParams.get("su")).toBe("Időpontkérés");
    expect(gmailUrl.searchParams.get("body")).toBe(expectedBody);

    const outlook = within(dialog).getByRole("link", { name: "Outlook.com" });
    expect(outlook).toHaveAttribute("target", "_blank");
    const outlookUrl = new URL(outlook.getAttribute("href")!);
    expect(outlookUrl.origin).toBe("https://outlook.live.com");
    expect(outlookUrl.searchParams.get("to")).toBe("info@alpha-dent.eu");
    expect(outlookUrl.searchParams.get("subject")).toBe("Időpontkérés");
    expect(outlookUrl.searchParams.get("body")).toBe(expectedBody);
  });

  it("a másolás gomb a levél szövegét a vágólapra teszi, és jelzi", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const dialog = fillAndSubmit();
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Levél szövegének másolása" }));
    });
    expect(writeText).toHaveBeenCalledWith("Jövő héten jó lenne.\n\nKiss Anna\nTelefonszám: +36 30 123 4567");
    expect(within(dialog).getByRole("button", { name: "Kimásolva" })).toBeInTheDocument();
    expect(within(dialog).getByRole("status")).toHaveTextContent("Illessze be egy új levélbe");
  });

  it("ha a másolás nem sikerül, más lehetőséget ajánl", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    const dialog = fillAndSubmit();
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Levél szövegének másolása" }));
    });
    expect(within(dialog).getByRole("status")).toHaveTextContent("A másolás nem sikerült");
  });

  it("vissza lehet menni szerkeszteni, és a „Kész” bezárja", () => {
    fillAndSubmit();
    fireEvent.click(screen.getByRole("button", { name: "Vissza a szerkesztéshez" }));
    expect(screen.getByRole("textbox", { name: "Név" })).toHaveValue("Kiss Anna");
    fireEvent.click(screen.getByRole("button", { name: "Tovább a küldéshez" }));
    fireEvent.click(screen.getByRole("button", { name: "Kész" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("minden nyelven megvannak a számítógépes nézet szövegei", async () => {
    const { bookingResources } = await import("../../lib/i18n/booking");
    for (const locale of ["hu", "en", "de", "it"] as const) {
      const dialog = bookingResources[locale].booking.dialog as Record<string, string>;
      for (const key of ["chooseTitle", "chooseText", "mailApp", "gmail", "outlook", "copy", "copied", "copiedHint", "copyFailed", "to"]) {
        expect(dialog[key], `${locale}.${key}`).toBeTruthy();
      }
    }
  });
});
