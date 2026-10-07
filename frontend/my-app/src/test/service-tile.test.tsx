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
    const { container } = render(
      <ServiceTile
        title="Tanácsadás"
        href="/szolgaltatasaink/implantologia"
        imageUrl="https://res.cloudinary.com/demo/image/upload/v1/consult.jpg"
      />
    );
    // Decorative image (alt=""): the tile's heading names the service.
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/demo/image/upload/w_800,ar_4:3,c_fill,g_auto,q_70,f_auto/v1/consult.jpg"
    );
    expect(img.getAttribute("srcset")).toContain("400w");
    expect(img.getAttribute("srcset")).toContain("800w");
    expect(screen.queryByText("Cloudinary placeholder")).not.toBeInTheDocument();
  });

  it("nem Cloudinary URL esetén nem ad srcSet-et, de a src-t megtartja", () => {
    const { container } = render(
      <ServiceTile
        title="Tanácsadás"
        href="/szolgaltatasaink/implantologia"
        imageUrl="https://example.com/consult.jpg"
      />
    );
    // Decorative image (alt=""): the tile's heading names the service.
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("src", "https://example.com/consult.jpg");
    expect(img).not.toHaveAttribute("srcset");
  });
});
