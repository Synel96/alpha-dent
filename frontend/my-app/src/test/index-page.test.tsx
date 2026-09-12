import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

type ReturnObjectsOptions = { returnObjects?: boolean };

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: ReturnObjectsOptions) => {
      if (!options?.returnObjects) return key;
      if (key === "home.faq.items") {
        return [
          { question: "faq-question-1", answer: "faq-answer-1" },
          { question: "faq-question-2", answer: "faq-answer-2" },
        ];
      }
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

  it("megjeleníti a GYIK kérdéseket", () => {
    render(<Page />);
    expect(screen.getByText("faq-question-1")).toBeInTheDocument();
    expect(screen.getByText("faq-answer-1")).toBeInTheDocument();
  });

  it("megjeleníti az elérhetőségeket a kapcsolat szekcióban", () => {
    render(<Page />);
    expect(screen.getByText("9400 Sopron, Arany Janos u. 13.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+36 20 80 80 600" })).toHaveAttribute(
      "href",
      "tel:+36208080600"
    );
    expect(screen.getByRole("link", { name: "info@alpha-dent.eu" })).toHaveAttribute(
      "href",
      "mailto:info@alpha-dent.eu"
    );
  });
});
