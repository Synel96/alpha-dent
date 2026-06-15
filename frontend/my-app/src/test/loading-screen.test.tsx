import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingScreen } from "../../components/ui/loading-screen";

describe("LoadingScreen", () => {
  it("látható amikor visible={true}", () => {
    const { container } = render(<LoadingScreen visible={true} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass("opacity-100");
    expect(overlay).not.toHaveClass("opacity-0");
  });

  it("rejtett amikor visible={false}", () => {
    const { container } = render(<LoadingScreen visible={false} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass("opacity-0");
    expect(overlay).toHaveClass("pointer-events-none");
  });

  it("aria-hidden true amikor rejtett", () => {
    const { container } = render(<LoadingScreen visible={false} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  it("aria-hidden false amikor látható", () => {
    const { container } = render(<LoadingScreen visible={true} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute("aria-hidden", "false");
  });

  it("tartalmazza az α karaktert", () => {
    render(<LoadingScreen visible={true} />);
    expect(screen.getByText("α")).toBeInTheDocument();
  });

  it("tartalmazza a forgó gyűrűt", () => {
    const { container } = render(<LoadingScreen visible={true} />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
