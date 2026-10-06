import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("vike-react/usePageContext", () => ({
  usePageContext: vi.fn(),
}));

vi.mock("vike/client/router", () => ({
  navigate: vi.fn(),
}));

import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import {
  LanguageSwitcher,
  LanguageSwitcherCompact,
} from "../../components/ui/language-switcher";

const mockPageContext = usePageContext as ReturnType<typeof vi.fn>;
const mockNavigate = navigate as ReturnType<typeof vi.fn>;

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockPageContext.mockReturnValue({ locale: "hu", urlPathname: "/kapcsolat" });
  });

  it("a gombokat a nyelv saját nevén olvassa fel, a látható kóddal együtt", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: "Deutsch (DE)" })).toHaveAttribute("lang", "de");
    expect(screen.getByRole("button", { name: "Magyar (HU)" })).toBeInTheDocument();
  });

  it("az aktuális nyelv gombja van kiemelve (aria-current)", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("HU")).toHaveAttribute("aria-current", "true");
    expect(screen.getByText("EN")).toHaveAttribute("aria-current", "false");
  });

  it("más nyelvre váltva a lefordított, prefixelt útvonalra navigál", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("EN"));
    expect(mockNavigate).toHaveBeenCalledWith("/en/contact");
  });

  it("magyarra váltva a /hu prefixelt útvonalra navigál", () => {
    mockPageContext.mockReturnValue({ locale: "en", urlPathname: "/kapcsolat" });
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("HU"));
    expect(mockNavigate).toHaveBeenCalledWith("/hu/kapcsolat");
  });

  it("az aktuális nyelvre kattintva nem navigál újra", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("HU"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("LanguageSwitcherCompact", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockPageContext.mockReturnValue({ locale: "de", urlPathname: "/kerdesek" });
  });

  it("a jelenlegi nyelvet jeleníti meg a megnyitó gombon", () => {
    render(<LanguageSwitcherCompact />);
    expect(screen.getByRole("button", { name: "common.language: DE" })).toHaveTextContent("DE");
  });

  it("megnyitás után a kiválasztott nyelv prefixelt útvonalára navigál", () => {
    render(<LanguageSwitcherCompact />);
    fireEvent.click(screen.getByRole("button", { name: "common.language: DE" }));
    fireEvent.click(screen.getByText("IT"));
    expect(mockNavigate).toHaveBeenCalledWith("/it/faq");
  });

  it("aria-expanded és aria-haspopup jelzi a menü állapotát", () => {
    render(<LanguageSwitcherCompact />);
    const toggle = screen.getByRole("button", { name: "common.language: DE" });
    expect(toggle).toHaveAttribute("aria-haspopup", "menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("Escape lenyomására bezáródik a menü", () => {
    render(<LanguageSwitcherCompact />);
    fireEvent.click(screen.getByRole("button", { name: "common.language: DE" }));
    expect(screen.getByText("IT")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("IT")).not.toBeInTheDocument();
  });

  it("a menün kívülre kattintva bezáródik a menü", () => {
    render(
      <div>
        <div data-testid="outside">kívül</div>
        <LanguageSwitcherCompact />
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "common.language: DE" }));
    expect(screen.getByText("IT")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByText("IT")).not.toBeInTheDocument();
  });
});
