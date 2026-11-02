import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import "../../lib/i18n";
import i18n from "../../lib/i18n";
import { CLINIC } from "../../lib/clinic-info";
import { SocialLink, SocialSoonNote } from "../../components/ui/social-link";

const original = CLINIC.socialComingSoon;
const setComingSoon = (value: boolean) => {
  (CLINIC as { socialComingSoon: boolean }).socialComingSoon = value;
};

const renderLink = () =>
  render(
    <div>
      <SocialLink
        label="Instagram"
        href="https://www.instagram.com/alphadent_eu"
        icon={<svg />}
        className="live"
        soonClassName="soon"
      />
      <SocialSoonNote />
    </div>
  );

describe("SocialLink", () => {
  afterEach(() => {
    setComingSoon(original);
    void i18n.changeLanguage("hu");
  });

  it("is a greyed-out, non-clickable icon with a coming-soon note while the profiles are empty", async () => {
    setComingSoon(true);
    await i18n.changeLanguage("hu");
    renderLink();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("img", { name: "Instagram – Hamarosan" })).toHaveClass("soon");
    expect(screen.getByText("Hamarosan")).toBeInTheDocument();
  });

  it("says coming soon in German too", async () => {
    setComingSoon(true);
    await i18n.changeLanguage("de");
    renderLink();
    expect(screen.getByRole("img", { name: "Instagram – Demnächst" })).toBeInTheDocument();
  });

  it("links to the profile in a new tab once switched on", () => {
    setComingSoon(false);
    renderLink();
    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/alphadent_eu");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.queryByText("Hamarosan")).toBeNull();
  });
});
