import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { localizeHref } from "../../../lib/locale";

export { Page };

type Item = { title: string; text: string };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const cases = t("services.implantologia.cases", { returnObjects: true }) as Item[];
  const steps = t("services.implantologia.steps", { returnObjects: true }) as Item[];
  const paragraphs = t("services.implantologia.paragraphs", { returnObjects: true }) as string[];

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
          {t("services.implantologia.title")}
        </h1>
        <p className="text-lg italic leading-snug text-brand-gold-light/90">
          {t("services.implantologia.tagline")}
        </p>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-brand-gold-muted md:text-base">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {cases.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-brand-border bg-brand-surface/60 p-5"
          >
            <h3 className="mb-2 text-sm uppercase tracking-[0.15em] text-brand-gold-light">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-brand-gold-muted">{item.text}</p>
          </article>
        ))}
      </section>

      <p className="max-w-3xl text-sm italic leading-relaxed text-brand-gold-muted">
        {t("services.implantologia.closing")}
      </p>

      <section>
        <h2 className="mb-5 text-xl font-semibold text-brand-gold-light md:text-2xl">
          {t("services.implantologia.processTitle")}
        </h2>
        <ol className="space-y-4">
          {steps.map((step) => (
            <li
              key={step.title}
              className="rounded-xl border border-brand-border bg-brand-surface/40 p-4"
            >
              <h3 className="text-sm font-semibold text-brand-gold-light">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-gold-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
