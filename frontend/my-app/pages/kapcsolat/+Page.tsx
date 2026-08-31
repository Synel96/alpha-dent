import { useTranslation } from "react-i18next";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { TextImageReveal } from "../../components/ui/text-image-reveal";
import { COMPANY_INFO as CONTACT_INFO } from "../../lib/company";

export { Page };

function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <TextImageReveal
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        description={t("contactPage.intro")}
      >
        <div className="flex flex-wrap gap-3">
          <CtaButton
            href={CONTACT_INFO.mapUrl}
            target="_blank"
            rel="noreferrer"
            badge={t("contactPage.cards.address")}
            title={t("contactPage.actions.openMap")}
            subtitle={CONTACT_INFO.address}
            className="min-w-[280px]"
          />
          <CtaButton
            href={CONTACT_INFO.mobileHref}
            badge={t("contactPage.cards.mobile")}
            title={t("contactPage.actions.callNow")}
            subtitle={CONTACT_INFO.mobileDisplay}
            className="min-w-[260px]"
          />
        </div>
      </TextImageReveal>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.address")}
          </h3>
          <p className="mb-3 text-sm text-brand-gold-muted">{CONTACT_INFO.address}</p>
          <a
            href={CONTACT_INFO.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-gold hover:text-brand-gold-light"
          >
            {t("contactPage.actions.openMap")}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.mobile")}
          </h3>
          <a
            href={CONTACT_INFO.mobileHref}
            className="text-sm text-brand-gold hover:text-brand-gold-light"
          >
            {CONTACT_INFO.mobileDisplay}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.phone")}
          </h3>
          <div className="space-y-2">
            <a
              href={CONTACT_INFO.phoneMainHref}
              className="block text-sm text-brand-gold hover:text-brand-gold-light"
            >
              {CONTACT_INFO.phoneMainDisplay}
            </a>
            <a
              href={CONTACT_INFO.phoneAltHref}
              className="block text-sm text-brand-gold hover:text-brand-gold-light"
            >
              {CONTACT_INFO.phoneAltDisplay}
            </a>
          </div>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.email")}
          </h3>
          <a
            href={CONTACT_INFO.emailHref}
            className="text-sm text-brand-gold hover:text-brand-gold-light"
          >
            {CONTACT_INFO.email}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5 sm:col-span-2 lg:col-span-2">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.gps")}
          </h3>
          <p className="mb-3 text-sm text-brand-gold-muted">{CONTACT_INFO.gps}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={CONTACT_INFO.gpsMapUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-brand-gold hover:text-brand-gold-light"
            >
              {t("contactPage.actions.openByGps")}
            </a>
            <a
              href={CONTACT_INFO.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-brand-gold hover:text-brand-gold-light"
            >
              {t("contactPage.actions.openWebsite")}
            </a>
          </div>
        </article>
      </section>
    </PageContainer>
  );
}
