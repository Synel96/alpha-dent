import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) =>
      options?.returnObjects ? [`${key}.0`, `${key}.1`] : key,
  }),
}));

import { Page } from "../../pages/szolgaltatasaink/+Page";

describe("Szolgaltatasaink oldal", () => {
  it("mind a 8 szolgáltatás csempét megjeleníti", () => {
    render(<Page />);
    expect(screen.getAllByRole("button")).toHaveLength(8);
  });

  it("csempére kattintva megnyitja a modalt a helyes címmel és listával", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("servicesPage.tiles.consultingDiagnostic"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "servicesPage.tiles.consultingDiagnostic" })
    ).toBeInTheDocument();
    expect(screen.getByText("servicesPage.details.consultingDiagnostic.0")).toBeInTheDocument();
    expect(screen.getByText("servicesPage.details.consultingDiagnostic.1")).toBeInTheDocument();
  });

  it("a modal bezárása után eltűnik a tartalma", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("servicesPage.tiles.other"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
