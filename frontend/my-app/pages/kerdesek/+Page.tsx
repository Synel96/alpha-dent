import React from "react";
import { useTranslation } from "react-i18next";
import { CtaButton } from "../../components/ui/cta-button";
import { FaqAccordion } from "../../components/ui/faq-accordion";
import { PageContainer } from "../../components/ui/page-container";
import { TextImageReveal } from "../../components/ui/text-image-reveal";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
] as const;

export { Page };

function Page() {
  const { t } = useTranslation();

  const items: FaqItem[] = FAQ_KEYS.map((key) => ({
    question: t(`faqPage.items.${key}.question`),
    answer: t(`faqPage.items.${key}.answer`),
  }));

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <TextImageReveal
        eyebrow={t("faqPage.eyebrow")}
        title={t("faqPage.title")}
        description={t("faqPage.intro")}
      />

      <FaqAccordion items={items} />

      <section className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.16),transparent_45%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-8">
        <h2 className="text-xl font-semibold text-brand-gold-light">{t("faqPage.ctaTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-brand-gold-muted md:text-base">
          {t("faqPage.ctaDescription")}
        </p>
        <div className="mt-5">
          <CtaButton
            href="/kapcsolat"
            badge={t("nav.contact")}
            title={t("faqPage.ctaButton")}
            className="min-w-[260px]"
          />
        </div>
      </section>
    </PageContainer>
  );
}
