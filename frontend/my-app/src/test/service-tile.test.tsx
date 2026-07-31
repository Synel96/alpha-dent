import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServiceTile } from "../../components/ui/service-tile";

describe("ServiceTile", () => {
  it("kép nélkül a Cloudinary placeholder jelzést mutatja", () => {
    render(<ServiceTile title="Tanácsadás" />);
    expect(screen.getByText("Cloudinary placeholder")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("Cloudinary URL esetén reszponzív srcSet-et generál, és eltünteti a placeholdert", () => {
    render(
      <ServiceTile
        title="Tanácsadás"
        imageUrl="https://res.cloudinary.com/demo/image/upload/v1/consult.jpg"
      />
    );
    const img = screen.getByRole("img", { name: "Tanácsadás" });
    expect(img).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,g_auto,q_auto,f_auto/v1/consult.jpg"
    );
    expect(img.getAttribute("srcset")).toContain("400w");
    expect(img.getAttribute("srcset")).toContain("1200w");
    expect(screen.queryByText("Cloudinary placeholder")).not.toBeInTheDocument();
  });

  it("nem Cloudinary URL esetén nem ad srcSet-et, de a src-t megtartja", () => {
    render(<ServiceTile title="Tanácsadás" imageUrl="https://example.com/consult.jpg" />);
    const img = screen.getByRole("img", { name: "Tanácsadás" });
    expect(img).toHaveAttribute("src", "https://example.com/consult.jpg");
    expect(img).not.toHaveAttribute("srcset");
  });
});
