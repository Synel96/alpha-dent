import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

type ReturnObjectsOptions = { returnObjects?: boolean };

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: ReturnObjectsOptions) => {
      if (!options?.returnObjects) return key;
      return [`${key}-0`, `${key}-1`];
    },
  }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { Page } from "../../pages/index/+Page";

describe("Főoldal", () => {
  it("megjeleníti a hero mottót", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("home.hero.motto");
  });

  it("megjeleníti a 'Miért Alphadent?' és a küldetés szekciót a bekezdéseikkel", () => {
    render(<Page />);
    expect(screen.getByText("home.whyUs.title")).toBeInTheDocument();
    expect(screen.getByText("home.whyUs.paragraphs-0")).toBeInTheDocument();
    expect(screen.getByText("home.mission.title")).toBeInTheDocument();
    expect(screen.getByText("home.mission.paragraphs-1")).toBeInTheDocument();
  });

  it("a szolgáltatások carouselje mind a 4 szolgáltatásra mutató linket megjeleníti", () => {
    render(<Page />);
    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) => (link.getAttribute("href") ?? "").startsWith("/szolgaltatasaink/"));

    expect(serviceLinks).toHaveLength(4);
    expect(serviceLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/szolgaltatasaink/implantologia",
      "/szolgaltatasaink/szajsebeszet",
      "/szolgaltatasaink/esztetikai-fogaszat",
      "/szolgaltatasaink/fogmegtarto-kezelesek",
    ]);
  });

  it("a szolgáltatások carouselje asztali nézethez nyíl gombokat is renderel", () => {
    render(<Page />);
    expect(screen.getByRole("button", { name: "common.carousel.prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "common.carousel.next" })).toBeInTheDocument();
  });

  it("nem jeleníti meg a GYIK szekciót - az a GYIK menüpontban él", () => {
    render(<Page />);
    expect(screen.queryByText("home.faq.title")).not.toBeInTheDocument();
  });

  it("a kapcsolat szekció csak egy rövid CTA-t mutat a kapcsolat oldalra, nem az elérhetőségeket", () => {
    render(<Page />);
    expect(screen.getByText("home.contact.title")).toBeInTheDocument();
    expect(screen.queryByText("9400 Sopron, Arany Janos u. 13.")).not.toBeInTheDocument();

    const ctaLinks = screen.getAllByRole("link", { name: "home.intro.ctaButton" });
    expect(ctaLinks.length).toBeGreaterThan(0);
    for (const link of ctaLinks) {
      expect(link).toHaveAttribute("href", "/kapcsolat");
    }
  });
});
