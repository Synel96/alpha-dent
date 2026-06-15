import React from "react";
import { useTranslation } from "react-i18next";
import "./Layout.css";
import "../lib/i18n";
import { Footer } from "../components/ui/footer";
import { LoadingScreen } from "../components/ui/loading-screen";
import { AlphaGlyph } from "../components/ui/alpha-glyph";
import {
  LanguageSwitcher,
  LanguageSwitcherCompact,
} from "../components/ui/language-switcher";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../components/ui/sheet";

const navLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.clinic", href: "/klinikank" },
  { labelKey: "nav.services", href: "/szolgaltatasaink" },
  { labelKey: "nav.story", href: "/tortenetunk" },
  { labelKey: "nav.faq", href: "/kerdesek" },
  { labelKey: "nav.contact", href: "/kapcsolat" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  React.useEffect(() => {
    // Hide initial loader after first render
    setLoading(false);

    // Show/hide loader during page transitions
    const show = () => setLoading(true);
    const hide = () => setLoading(false);
    window.addEventListener("alphadent:loading:start", show);
    window.addEventListener("alphadent:loading:end", hide);
    return () => {
      window.removeEventListener("alphadent:loading:start", show);
      window.removeEventListener("alphadent:loading:end", hide);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-black font-sans antialiased text-brand-gold flex flex-col">
      <LoadingScreen visible={loading} />
      <header className="border-b border-brand-border bg-brand-black/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-brand-gold transition-colors hover:text-brand-gold-light"
          >
            <AlphaGlyph glow className="text-4xl" />
            <span className="uppercase tracking-[0.32em]">Alphadent</span>
          </a>

          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={link.href}
                      className="px-3 py-2 text-sm tracking-wide text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold rounded-md transition-colors"
                    >
                      {t(link.labelKey)}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcherCompact />
            </div>

            <div className="flex md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label={t("common.menuOpen")}
                    className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-md hover:bg-brand-surface"
                  >
                    <span
                      className={`block h-[2px] w-[18px] bg-brand-gold transition-all duration-300 ${
                        open
                          ? "translate-y-[7px] rotate-45 bg-brand-gold-light"
                          : ""
                      }`}
                    />
                    <span
                      className={`block h-[2px] w-[18px] bg-brand-gold transition-all duration-300 ${
                        open ? "opacity-0" : ""
                      }`}
                    />
                    <span
                      className={`block h-[2px] w-[18px] bg-brand-gold transition-all duration-300 ${
                        open
                          ? "-translate-y-[7px] -rotate-45 bg-brand-gold-light"
                          : ""
                      }`}
                    />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-3/4"
                  aria-describedby={undefined}
                >
                  <SheetTitle className="sr-only">Navigáció</SheetTitle>
                  <nav className="flex flex-col gap-1 px-4 pt-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-sm tracking-wide text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold transition-colors"
                      >
                        {t(link.labelKey)}
                      </a>
                    ))}
                    <div className="mt-4 border-t border-brand-border pt-4">
                      <p className="mb-2 text-xs uppercase tracking-wide text-brand-gold-muted">
                        Nyelv
                      </p>
                      <LanguageSwitcher />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
