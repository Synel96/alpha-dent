import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import i18n from "../../lib/i18n";
import { ClinicHighlights } from "../../components/ui/clinic-highlights";

describe("Bizalmi számok (főoldal + Klinikánk)", () => {
  afterEach(() => i18n.changeLanguage("hu"));

  it("magyarul: 1996, 15 fő, CAMLOG Gold, a magyarázó szöveggel", () => {
    render(<ClinicHighlights />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("1996")).toBeInTheDocument();
    expect(screen.getByText("15 fő")).toBeInTheDocument();
    expect(screen.getByText("CAMLOG Gold")).toBeInTheDocument();
    expect(screen.getByText("tapasztalt szakmai csapat")).toBeInTheDocument();
  });

  it("a többi nyelven is három tétel van, értékkel és szöveggel", async () => {
    for (const locale of ["en", "de", "it"]) {
      await i18n.changeLanguage(locale);
      const { unmount } = render(<ClinicHighlights />);
      const items = screen.getAllByRole("listitem");
      expect(items, locale).toHaveLength(3);
      for (const item of items) expect(item.textContent!.trim().length, locale).toBeGreaterThan(5);
      expect(screen.getByText("CAMLOG Gold")).toBeInTheDocument();
      unmount();
    }
  });
});
