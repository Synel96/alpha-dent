import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Award } from "lucide-react";
import { PillBadge } from "../../components/ui/pill-badge";

describe("PillBadge", () => {
  it("megjeleníti az ikont és a hozzá tartozó szöveget", () => {
    const { container } = render(<PillBadge icon={Award}>Minőségi ellátás</PillBadge>);
    expect(screen.getByText("Minőségi ellátás")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("a saját className-t hozzáfűzi az alap pill stílushoz", () => {
    const { container } = render(
      <PillBadge icon={Award} className="mt-4">
        Minőségi ellátás
      </PillBadge>
    );
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("mt-4");
    expect(badge?.className).toContain("rounded-full");
  });
});
