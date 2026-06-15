import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock vike-react/usePageContext
vi.mock("vike-react/usePageContext", () => ({
  usePageContext: vi.fn(),
}));

// Mock react-i18next – egyszerű kulcs-visszaadó
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { usePageContext } from "vike-react/usePageContext";
import ErrorPage from "../../pages/_error/+Page";

const mockPageContext = usePageContext as ReturnType<typeof vi.fn>;

describe("ErrorPage", () => {
  describe("404 – Nem található", () => {
    beforeEach(() => {
      mockPageContext.mockReturnValue({ is404: true });
    });

    it("a 404 title kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByRole("heading")).toHaveTextContent("error.404.title");
    });

    it("a 404 description kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByText("error.404.description")).toBeInTheDocument();
    });

    it("megmutatja a 404-es kódot a badge-ben", () => {
      render(<ErrorPage />);
      // A badge, a title és a description is tartalmaz "404"-et
      const elements = screen.getAllByText(/404/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it("tartalmaz 'vissza a főoldalra' linket", () => {
      render(<ErrorPage />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/");
      expect(link).toHaveTextContent("error.backHome");
    });
  });

  describe("500 – Szerverhiba", () => {
    beforeEach(() => {
      mockPageContext.mockReturnValue({ is404: false, abortStatusCode: 500 });
    });

    it("a 500 title kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByRole("heading")).toHaveTextContent("error.500.title");
    });

    it("a 500 description kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByText("error.500.description")).toBeInTheDocument();
    });

    it("megmutatja az 500-as kódot", () => {
      render(<ErrorPage />);
      const elements = screen.getAllByText(/500/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Ismeretlen hiba", () => {
    beforeEach(() => {
      mockPageContext.mockReturnValue({ is404: false });
    });

    it("a generic title kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByRole("heading")).toHaveTextContent(
        "error.generic.title"
      );
    });

    it("a generic description kulcsot jeleníti meg", () => {
      render(<ErrorPage />);
      expect(screen.getByText("error.generic.description")).toBeInTheDocument();
    });

    it("nem mutat hibakód badge-et", () => {
      render(<ErrorPage />);
      expect(screen.queryByText("error.errorCode")).not.toBeInTheDocument();
    });
  });

  describe("Közös elemek", () => {
    it("minden esetben tartalmaz α szimbólumot", () => {
      mockPageContext.mockReturnValue({ is404: true });
      render(<ErrorPage />);
      expect(screen.getByText("α")).toBeInTheDocument();
    });

    it("minden esetben tartalmaz főoldalra mutató linket", () => {
      mockPageContext.mockReturnValue({ is404: false });
      render(<ErrorPage />);
      expect(screen.getByRole("link")).toHaveAttribute("href", "/");
    });
  });
});
