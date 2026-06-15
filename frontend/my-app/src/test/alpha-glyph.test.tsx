import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlphaGlyph } from "../../components/ui/alpha-glyph";

describe("AlphaGlyph", () => {
  it("rendereli az α karaktert", () => {
    render(<AlphaGlyph />);
    expect(screen.getByText("α")).toBeInTheDocument();
  });

  it("glow={true} esetén loading-alpha-glow osztályt kap", () => {
    render(<AlphaGlyph glow />);
    expect(screen.getByText("α")).toHaveClass("loading-alpha-glow");
  });

  it("glow={false} esetén nincs loading-alpha-glow osztály", () => {
    render(<AlphaGlyph />);
    expect(screen.getByText("α")).not.toHaveClass("loading-alpha-glow");
  });

  it("egyéni className-t átvisz", () => {
    render(<AlphaGlyph className="text-8xl" />);
    expect(screen.getByText("α")).toHaveClass("text-8xl");
  });

  it("mindig tartalmazza az alap brand-gold osztályt", () => {
    render(<AlphaGlyph />);
    expect(screen.getByText("α")).toHaveClass("text-brand-gold");
  });
});
