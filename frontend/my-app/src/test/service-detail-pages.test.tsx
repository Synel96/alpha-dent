import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

type ReturnObjectsOptions = { returnObjects?: boolean };

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string, options?: ReturnObjectsOptions) => {
      if (!options?.returnObjects) return key;
      if (key.endsWith(".cases") || key.endsWith(".steps")) {
        return [
          { title: `${key}-0-title`, text: `${key}-0-text` },
          { title: `${key}-1-title`, text: `${key}-1-text` },
        ];
      }
      return [`${key}-0`, `${key}-1`];
    },
  }),
}));

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "hu" }),
}));

import { Page as ImplantologiaPage } from "../../pages/szolgaltatasaink/implantologia/+Page";
import { Page as SzajsebeszetPage } from "../../pages/szolgaltatasaink/szajsebeszet/+Page";
import { Page as EsztetikaiFogaszatPage } from "../../pages/szolgaltatasaink/esztetikai-fogaszat/+Page";
import { Page as FogmegtartoKezelesekPage } from "../../pages/szolgaltatasaink/fogmegtarto-kezelesek/+Page";

describe("Szolgáltatás aloldalak", () => {
  it("Implantológia: címet, bekezdéseket, eseteket/lépéseket és a kapcsolat CTA-t mutatja", () => {
    render(<ImplantologiaPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "services.implantologia.title"
    );
    expect(screen.getByText("services.implantologia.cases-0-title")).toBeInTheDocument();
    expect(screen.getByText("services.implantologia.steps-1-text")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← servicesHub.title" })).toHaveAttribute(
      "href",
      "/szolgaltatasaink"
    );
    expect(screen.getByRole("link", { name: "home.intro.ctaButton" })).toHaveAttribute(
      "href",
      "/kapcsolat"
    );
  });

  it("Szájsebészet: címet, felsorolást és a kapcsolat CTA-t mutatja", () => {
    render(<SzajsebeszetPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "services.szajsebeszet.title"
    );
    expect(screen.getByText("services.szajsebeszet.items-0")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.intro.ctaButton" })).toHaveAttribute(
      "href",
      "/kapcsolat"
    );
  });

  it("Esztétikai fogászat: címet, bekezdéseket és felsorolást mutat", () => {
    render(<EsztetikaiFogaszatPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "services.esztetikaiFogaszat.title"
    );
    expect(screen.getByText("services.esztetikaiFogaszat.paragraphs-0")).toBeInTheDocument();
    expect(screen.getByText("services.esztetikaiFogaszat.items-1")).toBeInTheDocument();
  });

  it("Fogmegtartó kezelések: címet és bekezdéseket mutat", () => {
    render(<FogmegtartoKezelesekPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "services.fogmegtartoKezelesek.title"
    );
    expect(screen.getByText("services.fogmegtartoKezelesek.paragraphs-0")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.intro.ctaButton" })).toHaveAttribute(
      "href",
      "/kapcsolat"
    );
  });
});
