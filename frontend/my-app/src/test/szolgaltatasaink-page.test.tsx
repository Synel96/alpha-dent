import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) =>
      options?.returnObjects ? [{ title: `${key}.0.title`, text: `${key}.0.text` }] : key,
  }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { Page } from "../../pages/szolgaltatasaink/+Page";

describe("Szolgaltatasaink oldal", () => {
  it("mind a 4 szolgáltatás csempét megjeleníti, saját aloldalra mutató linkkel", () => {
    render(<Page />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/szolgaltatasaink/implantologia",
      "/szolgaltatasaink/szajsebeszet",
      "/szolgaltatasaink/esztetikai-fogaszat",
      "/szolgaltatasaink/fogmegtarto-kezelesek",
    ]);
  });

  it("megjeleníti az eszközpark szekciót", () => {
    render(<Page />);
    expect(screen.getByText("servicesHub.toolkitTitle")).toBeInTheDocument();
    expect(screen.getByText("servicesHub.toolkitItems.0.title")).toBeInTheDocument();
  });
});
