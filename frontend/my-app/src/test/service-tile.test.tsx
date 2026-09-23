import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServiceTile } from "../../components/ui/service-tile";

describe("ServiceTile", () => {
  it("kép nélkül a Cloudinary placeholder jelzést mutatja", () => {
    render(<ServiceTile title="Tanácsadás" href="/szolgaltatasaink/implantologia" />);
    expect(screen.getByText("Cloudinary placeholder")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("a megadott href-re mutató linket ad", () => {
    render(<ServiceTile title="Implantológia" href="/szolgaltatasaink/implantologia" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/szolgaltatasaink/implantologia");
  });

  it("Cloudinary URL esetén reszponzív srcSet-et generál, és eltünteti a placeholdert", () => {
    render(
      <ServiceTile
        title="Tanácsadás"
        href="/szolgaltatasaink/implantologia"
        imageUrl="https://res.cloudinary.com/demo/image/upload/v1/consult.jpg"
      />
    );
    const img = screen.getByRole("img", { name: "Tanácsadás" });
    expect(img).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/demo/image/upload/w_800,c_fill,g_auto,q_78,f_auto/v1/consult.jpg"
    );
    expect(img.getAttribute("srcset")).toContain("400w");
    expect(img.getAttribute("srcset")).toContain("800w");
    expect(screen.queryByText("Cloudinary placeholder")).not.toBeInTheDocument();
  });

  it("nem Cloudinary URL esetén nem ad srcSet-et, de a src-t megtartja", () => {
    render(
      <ServiceTile
        title="Tanácsadás"
        href="/szolgaltatasaink/implantologia"
        imageUrl="https://example.com/consult.jpg"
      />
    );
    const img = screen.getByRole("img", { name: "Tanácsadás" });
    expect(img).toHaveAttribute("src", "https://example.com/consult.jpg");
    expect(img).not.toHaveAttribute("srcset");
  });
});
