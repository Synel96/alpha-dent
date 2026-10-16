import { Globe, MapPin, Stethoscope, Wallet, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { localizeHref } from "../../lib/locale";
import { CtaButton } from "../../components/ui/cta-button";
import { FaqAccordion } from "../../components/ui/faq-accordion";
import { PageContainer } from "../../components/ui/page-container";
import { RevealSection } from "../../components/ui/reveal-section";
import { TextImageReveal } from "../../components/ui/text-image-reveal";

type FaqTopic = {
  key: "location" | "international" | "treatment" | "costs";
  // Anchor of the topic's section - the same in every language, so a link
  // like /hu/kerdesek#megkozelites can point at a topic.
  anchor: string;
  icon: LucideIcon;
  questions: readonly string[];
};

// Getting here comes first: it's what most visitors from the area (and from
// across the Austrian border) want to know.
const FAQ_TOPICS: readonly FaqTopic[] = [
  { key: "location", anchor: "megkozelites", icon: MapPin, questions: ["q16", "q17", "q18"] },
  { key: "international", anchor: "kulfoldi-pacienseknek", icon: Globe, questions: ["q1", "q15", "q9", "q7"] },
  { key: "treatment", anchor: "kezeles", icon: Stethoscope, questions: ["q3", "q13", "q14", "q10", "q8"] },
  { key: "costs", anchor: "koltsegek", icon: Wallet, questions: ["q2", "q4", "q5", "q6"] },
];

const ICON_RING =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light";

export { Page };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <TextImageReveal
        eyebrow={t("faqPage.eyebrow")}
        title={t("faqPage.title")}
        description={t("faqPage.intro")}
        imageSrc="https://res.cloudinary.com/dmwulp3dl/image/upload/v1789381101/IMG_3397_gii27w.webp"
        imageAlt={t("faqPage.imageAlt")}
      />

      <nav aria-label={t("faqPage.topicsLabel")}>
        <ul className="flex flex-wrap gap-2">
          {FAQ_TOPICS.map(({ key, anchor, icon: Icon }) => (
            <li key={key}>
              <a
                href={`#${anchor}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-black/40 px-4 py-2 text-sm text-brand-gold-light transition-colors hover:border-brand-gold hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
              >
                <Icon aria-hidden className="size-4" />
                {t(`faqPage.topics.${key}.title`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {FAQ_TOPICS.map(({ key, anchor, icon: Icon, questions }, topicIndex) => (
        // scroll-mt: the fixed navbar mustn't cover the heading after a jump.
        <section key={key} id={anchor} aria-labelledby={`${anchor}-title`} className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className={ICON_RING}>
              <Icon className="size-5" />
            </span>
            <h2 id={`${anchor}-title`} className="text-xl font-semibold text-brand-gold-light md:text-2xl">
              {t(`faqPage.topics.${key}.title`)}
            </h2>
          </div>
          <FaqAccordion
            // Only the very first question of the page starts open.
            defaultOpenIndex={topicIndex === 0 ? 0 : -1}
            items={questions.map((question) => ({
              question: t(`faqPage.items.${question}.question`),
              answer: t(`faqPage.items.${question}.answer`),
            }))}
          />
        </section>
      ))}

      <RevealSection>
        <section className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.16),transparent_45%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-brand-gold-light">{t("faqPage.ctaTitle")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white md:text-base">
            {t("faqPage.ctaDescription")}
          </p>
          <div className="mt-5">
            <CtaButton
              href={localizeHref(locale, "/kapcsolat")}
              badge={t("nav.contact")}
              title={t("faqPage.ctaButton")}
              className="min-w-[260px]"
            />
          </div>
        </section>
      </RevealSection>
    </PageContainer>
  );
}
