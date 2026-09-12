import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { localizeHref } from "../../../lib/locale";

export { Page };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const items = t("services.szajsebeszet.items", { returnObjects: true }) as string[];

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <a
        href={localizeHref(locale, "/szolgaltatasaink")}
        className="text-sm text-brand-gold-muted hover:text-brand-gold"
      >
        ← {t("servicesHub.title")}
      </a>

      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
          {t("nav.services")}
        </p>
        <h1 className="text-2xl font-semibold text-brand-gold-light md:text-4xl">
          {t("services.szajsebeszet.title")}
        </h1>
        <p className="text-lg italic leading-snug text-brand-gold-light/90">
          {t("services.szajsebeszet.tagline")}
        </p>
        <p className="text-sm leading-relaxed text-brand-gold-muted md:text-base">
          {t("services.szajsebeszet.intro")}
        </p>
      </div>

      <section className="max-w-3xl space-y-3">
        <p className="text-sm text-brand-gold-muted">{t("services.szajsebeszet.listIntro")}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-brand-border bg-brand-surface/55 px-3 py-2 text-sm leading-relaxed text-brand-gold-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
