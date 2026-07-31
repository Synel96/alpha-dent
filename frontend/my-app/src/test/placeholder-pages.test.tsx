import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { Page as KlinikankPage } from "../../pages/klinikank/+Page";
import { Page as TortenetunkPage } from "../../pages/tortenetunk/+Page";

describe("Klinikank (hamarosan) oldal", () => {
  it("a nav.clinic címet és a hamarosan szöveget jeleníti meg", () => {
    render(<KlinikankPage />);
    expect(screen.getByRole("heading", { name: "nav.clinic" })).toBeInTheDocument();
    expect(screen.getByText("common.comingSoon.description")).toBeInTheDocument();
  });
});

describe("Tortenetunk (hamarosan) oldal", () => {
  it("a nav.story címet és a hamarosan szöveget jeleníti meg", () => {
    render(<TortenetunkPage />);
    expect(screen.getByRole("heading", { name: "nav.story" })).toBeInTheDocument();
    expect(screen.getByText("common.comingSoon.description")).toBeInTheDocument();
  });
});
