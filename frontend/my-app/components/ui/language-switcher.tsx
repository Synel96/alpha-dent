import React from "react";
import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { LOCALES, localizeHref, type Locale } from "@/lib/locale";

const LANGUAGE_LABELS: Record<Locale, string> = {
  hu: "HU",
  en: "EN",
  de: "DE",
  it: "IT",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

function useLocaleSwitch() {
  const { locale, urlPathname } = usePageContext();

  return (target: Locale) => {
    if (target === locale) return;
    if (typeof document !== "undefined") document.documentElement.lang = target;
    void navigate(localizeHref(target, urlPathname));
  };
}

export function LanguageSwitcher() {
  const { locale } = usePageContext();
  const switchLocale = useLocaleSwitch();

  return (
    <div className="flex gap-1">
      {LOCALES.map((code) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${FOCUS_RING} ${
            locale === code
              ? "bg-brand-gold text-brand-black"
              : "text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold"
          }`}
          aria-label={`Switch to ${LANGUAGE_LABELS[code]}`}
          aria-current={locale === code ? "true" : "false"}
        >
          {LANGUAGE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

export function LanguageSwitcherCompact() {
  const { locale } = usePageContext();
  const switchLocale = useLocaleSwitch();
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className={`px-3 py-2 text-sm font-semibold text-brand-gold hover:bg-brand-surface rounded-md transition-colors ${FOCUS_RING}`}
        aria-label="Switch language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {LANGUAGE_LABELS[locale]}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-24 bg-brand-black border border-brand-border rounded-md shadow-lg z-50"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              role="menuitem"
              onClick={() => {
                switchLocale(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors ${FOCUS_RING} focus-visible:ring-inset ${
                locale === code
                  ? "bg-brand-gold text-brand-black"
                  : "text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold"
              }`}
              aria-current={locale === code ? "true" : "false"}
            >
              {LANGUAGE_LABELS[code]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
