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
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-semibold text-brand-gold hover:bg-brand-surface rounded-md transition-colors"
        aria-label="Switch language"
      >
        {LANGUAGE_LABELS[locale]}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-brand-black border border-brand-border rounded-md shadow-lg z-50">
          {LOCALES.map((code) => (
            <button
              key={code}
              onClick={() => {
                switchLocale(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
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
