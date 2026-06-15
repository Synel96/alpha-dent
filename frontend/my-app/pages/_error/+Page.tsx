import React from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useTranslation } from "react-i18next";
import { AlphaGlyph } from "../../components/ui/alpha-glyph";

export default function Page() {
  const { is404, abortStatusCode } = usePageContext() as {
    is404?: boolean;
    abortStatusCode?: number;
  };
  const { t } = useTranslation();

  // Determine error code
  const code = is404 ? 404 : abortStatusCode && abortStatusCode >= 500 ? 500 : null;

  const titleKey = code === 404
    ? "error.404.title"
    : code === 500
    ? "error.500.title"
    : "error.generic.title";

  const descKey = code === 404
    ? "error.404.description"
    : code === 500
    ? "error.500.description"
    : "error.generic.description";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Glowing α */}
      <AlphaGlyph glow className="text-8xl mb-6" />

      {/* Error code badge */}
      {code && (
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-brand-gold-muted">
          {t("error.errorCode")} &mdash; {code}
        </p>
      )}

      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-brand-gold">
        {t(titleKey)}
      </h1>

      <p className="mb-8 max-w-sm text-sm leading-relaxed text-brand-gold-muted">
        {t(descKey)}
      </p>

      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-md border border-brand-gold/40 px-5 py-2.5 text-sm tracking-wide text-brand-gold transition-colors hover:bg-brand-surface hover:border-brand-gold"
      >
        {t("error.backHome")}
      </a>
    </div>
  );
}
