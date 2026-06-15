import React from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "hu", label: "HU" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "it", label: "IT" },
  ] as const;

  return (
    <div className="flex gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            i18n.language === lang.code
              ? "bg-brand-gold text-brand-black"
              : "text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold"
          }`}
          aria-label={`Switch to ${lang.label}`}
          aria-current={i18n.language === lang.code ? "true" : "false"}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export function LanguageSwitcherCompact() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: "hu", label: "HU" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "it", label: "IT" },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-semibold text-brand-gold hover:bg-brand-surface rounded-md transition-colors"
        aria-label="Switch language"
      >
        {i18n.language.toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-brand-black border border-brand-border rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                i18n.language === lang.code
                  ? "bg-brand-gold text-brand-black"
                  : "text-brand-gold-muted hover:bg-brand-surface hover:text-brand-gold"
              }`}
              aria-current={i18n.language === lang.code ? "true" : "false"}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
