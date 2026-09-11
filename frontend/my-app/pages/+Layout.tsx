import React from "react";
import { navigate } from "vike/client/router";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import "./Layout.css";
import "../lib/i18n";
import { localizeHref } from "../lib/locale";
import { Footer } from "../components/ui/footer";
import { LoadingScreen } from "../components/ui/loading-screen";
import {
  subscribeHeroProgress,
  getHeroProgress,
  getHeroProgressServerSnapshot,
} from "../components/ui/hero";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../components/ui/sheet";

const navLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.clinic", href: "/klinikank" },
  { labelKey: "nav.services", href: "/szolgaltatasaink" },
  { labelKey: "nav.story", href: "/tortenetunk" },
  { labelKey: "nav.faq", href: "/kerdesek" },
  { labelKey: "nav.contact", href: "/kapcsolat" },
];

// Only show the loading screen once a page transition has actually taken
// this long - most navigations resolve well under this, and flashing the
// spinner for a single frame on every click is worse than no indicator.
const LOADING_SCREEN_DELAY_MS = 250;

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // 1 = fully opaque navbar (the default for pages without a hero). Pages
  // rendering <Hero> drive this down to 0 while its media fills the
  // viewport, then back up to 1 by the time the hero's bottom is reached.
  // useSyncExternalStore (rather than state + a window event listener)
  // guarantees this reads Hero's real initial value on the very first
  // paint, even though Hero's own mount effect fires before this
  // component's effects ever get a chance to subscribe.
  const heroProgress = React.useSyncExternalStore(
    subscribeHeroProgress,
    getHeroProgress,
    getHeroProgressServerSnapshot
  );
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { locale } = usePageContext();
  const { t, i18n } = useTranslation();

  // The URL locale prefix is the source of truth for the active language.
  // This must run synchronously during render (not in an effect) so that
  // this component's own t() calls below, and every descendant Page's,
  // already see the right language on the very first render (SSR + hydration).
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  const localizedNavLinks = navLinks.map((link) => ({
    ...link,
    href: localizeHref(locale, link.href),
  }));
  const homeHref = localizeHref(locale, "/");

  const handleInternalLink = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeMenu = false) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      if (closeMenu) setOpen(false);
      void navigate(href);
    },
    []
  );

  React.useLayoutEffect(() => {
    // The header is `fixed` (so it can sit transparently over a page's
    // hero media) rather than taking up space in normal flow, so every
    // page needs its content pushed down by the header's real height via
    // this --nav-height var - <Hero> then cancels it out with a matching
    // negative margin to sit at y=0, underneath the header.
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return;

    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty("--nav-height", `${header.offsetHeight}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    let showTimer: number | undefined;

    const show = () => {
      if (showTimer) return;
      showTimer = window.setTimeout(() => {
        showTimer = undefined;
        setLoading(true);
      }, LOADING_SCREEN_DELAY_MS);
    };

    const hide = () => {
      if (showTimer) {
        window.clearTimeout(showTimer);
        showTimer = undefined;
      }
      setLoading(false);
    };

    window.addEventListener("alphadent:loading:start", show);
    window.addEventListener("alphadent:loading:end", hide);
    return () => {
      window.removeEventListener("alphadent:loading:start", show);
      window.removeEventListener("alphadent:loading:end", hide);
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-black font-sans antialiased text-brand-gold flex flex-col">
      <LoadingScreen visible={loading} />
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200"
        style={{
          backgroundColor: `rgba(8, 8, 10, ${0.9 * heroProgress})`,
          borderColor: `rgba(28, 28, 32, ${heroProgress})`,
          backdropFilter: heroProgress > 0 ? `blur(${8 * heroProgress}px)` : undefined,
          WebkitBackdropFilter: heroProgress > 0 ? `blur(${8 * heroProgress}px)` : undefined,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href={homeHref}
            onClick={(event) => handleInternalLink(event, homeHref)}
            className="flex items-center rounded-md text-lg font-semibold text-brand-gold transition-colors hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
          >
            <span className="uppercase tracking-[0.32em]">Alphadent</span>
          </a>

          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-1">
                {localizedNavLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={link.href}
                      onClick={(event) => handleInternalLink(event, link.href)}
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
                    className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-md hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
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
                  <SheetTitle className="sr-only">{t("common.navigation")}</SheetTitle>
                  <nav className="flex flex-col gap-1 px-4 pt-4">
                    {localizedNavLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(event) => handleInternalLink(event, link.href, true)}
                        className="rounded-md px-3 py-2.5 text-sm tracking-wide text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 transition-colors"
                      >
                        {t(link.labelKey)}
                      </a>
                    ))}
                    <div className="mt-4 border-t border-brand-border pt-4">
                      <p className="mb-2 text-xs uppercase tracking-wide text-brand-gold-muted">
                        {t("common.language")}
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

      <main className="flex-1" style={{ paddingTop: "var(--nav-height, 72px)" }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
