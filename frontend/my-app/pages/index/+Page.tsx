import { Award, HelpCircle, Phone, Smile, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Hero } from "../../components/ui/hero";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { PillBadge } from "../../components/ui/pill-badge";
import { RevealSection } from "../../components/ui/reveal-section";
import { ServiceCarousel } from "../../components/ui/service-carousel";
import { ServiceTile } from "../../components/ui/service-tile";
import { localizeHref } from "../../lib/locale";
import { useReveal } from "../../lib/use-reveal";
import { cn } from "../../lib/utils";

export { Page };

const HERO_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp";

const CONTACT_INFO = {
  address: "9400 Sopron, Arany Janos u. 13.",
  mobileDisplay: "+36 20 80 80 600",
  mobileHref: "tel:+36208080600",
  phoneMainDisplay: "+36 99 788 888",
  phoneMainHref: "tel:+3699788888",
  email: "info@alpha-dent.eu",
  emailHref: "mailto:info@alpha-dent.eu",
} as const;

const SERVICE_SLUGS = [
  "implantologia",
  "szajsebeszet",
  "esztetikaiFogaszat",
  "fogmegtartoKezelesek",
] as const;

const SERVICE_PATHS: Record<(typeof SERVICE_SLUGS)[number], string> = {
  implantologia: "/szolgaltatasaink/implantologia",
  szajsebeszet: "/szolgaltatasaink/szajsebeszet",
  esztetikaiFogaszat: "/szolgaltatasaink/esztetikai-fogaszat",
  fogmegtartoKezelesek: "/szolgaltatasaink/fogmegtarto-kezelesek",
};

const SERVICE_IMAGES: Partial<Record<(typeof SERVICE_SLUGS)[number], string>> = {
  implantologia: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789208024/IMG_3400_dsepbw.webp",
  szajsebeszet: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789215806/IMG_3398_dmrstv.webp",
};

// Fade + float up, staggered across the heading/paragraph of the intro
// section below, triggered once that section scrolls into view. Deliberately
// not used in <Hero>: that's above the fold and already visible on first
// paint, so gating it behind a scroll observer would only add cost against
// Lighthouse without anything to gain.
const REVEAL_CLASS =
  "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none";

type FaqItem = { question: string; answer: string };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const { ref: introRef, visible: introVisible } = useReveal<HTMLDivElement>();

  const faqItems = t("home.faq.items", { returnObjects: true }) as FaqItem[];
  const whyUsParagraphs = t("home.whyUs.paragraphs", { returnObjects: true }) as string[];
  const missionParagraphs = t("home.mission.paragraphs", { returnObjects: true }) as string[];

  const kapcsolatHref = localizeHref(locale, "/kapcsolat");

  return (
    <>
      <Hero
        imageSrc={HERO_IMAGE}
        imageAlt="Alphadent"
        quote={t("home.hero.motto")}
        brandMark="Alphadent"
        ctaHref={kapcsolatHref}
        ctaLabel={t("home.intro.ctaButton")}
      />

      {/* Intro */}
      <section className="relative overflow-hidden border-b border-brand-border bg-[radial-gradient(circle_at_50%_0%,rgba(228,196,106,0.08),transparent_55%)]">
        <PageContainer className="py-16 md:py-24">
          <div
            ref={introRef}
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          >
            <h2
              style={{ transitionDelay: "0ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl"
              )}
            >
              {t("home.intro.title")}
            </h2>
            <p
              style={{ transitionDelay: "140ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "max-w-2xl text-sm leading-relaxed text-white md:text-base"
              )}
            >
              {t("home.intro.description")}
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Services teaser */}
      <section className="border-b border-brand-border">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="space-y-8">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <PillBadge icon={Stethoscope}>{t("home.servicesTeaser.eyebrow")}</PillBadge>
              <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
                {t("home.servicesTeaser.title")}
              </h2>
            </div>

            <ServiceCarousel>
              {SERVICE_SLUGS.map((key, index) => (
                <ServiceTile
                  key={key}
                  title={t(`services.${key}.nav`)}
                  href={localizeHref(locale, SERVICE_PATHS[key])}
                  imageUrl={SERVICE_IMAGES[key]}
                  delayMs={index * 60}
                  className="w-[80%] shrink-0 snap-start sm:w-[48%] lg:w-[34%] xl:w-[27%]"
                />
              ))}
            </ServiceCarousel>

            <div className="text-center">
              <a
                href={localizeHref(locale, "/szolgaltatasaink")}
                className="text-sm text-brand-gold-muted underline underline-offset-4 hover:text-brand-gold"
              >
                {t("home.servicesTeaser.moreLink")} →
              </a>
            </div>
          </RevealSection>
        </PageContainer>
      </section>

      {/* Miert Alphadent? */}
      <section className="border-b border-brand-border">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-4">
            <PillBadge icon={Award}>{t("home.whyUs.eyebrow")}</PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.whyUs.title")}
            </h2>
            {whyUsParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
                {paragraph}
              </p>
            ))}
            <p className="text-sm italic leading-relaxed text-brand-gold-muted">
              {t("home.whyUs.closing")}
            </p>
          </RevealSection>
        </PageContainer>
      </section>

      {/* Mission */}
      <section className="border-b border-brand-border bg-brand-surface/40">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-4 text-center">
            <PillBadge icon={Smile}>{t("home.mission.eyebrow")}</PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.mission.title")}
            </h2>
            {missionParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
                {paragraph}
              </p>
            ))}
          </RevealSection>
        </PageContainer>
      </section>

      {/* FAQ teaser */}
      <section className="border-b border-brand-border bg-brand-surface/40">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-6">
            <PillBadge icon={HelpCircle}>{t("nav.faq")}</PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.faq.title")}
            </h2>

            <div className="space-y-3">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-brand-border bg-brand-black/40 p-5"
                >
                  <h3 className="mb-2 text-sm font-semibold text-brand-gold-light">
                    {item.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-gold-muted">{item.answer}</p>
                </div>
              ))}
            </div>

            <p className="text-sm italic leading-relaxed text-brand-gold-muted">
              {t("home.faq.closing")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CtaButton
                href={kapcsolatHref}
                badge={t("nav.contact")}
                title={t("home.faq.ctaTitle")}
                subtitle={t("home.intro.ctaButton")}
              />
              <a
                href={localizeHref(locale, "/kerdesek")}
                className="text-sm text-brand-gold-muted underline underline-offset-4 hover:text-brand-gold"
              >
                {t("home.faq.moreLink")} →
              </a>
            </div>
          </RevealSection>
        </PageContainer>
      </section>

      {/* Contact teaser */}
      <section>
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-3">
              <PillBadge icon={Phone}>{t("nav.contact")}</PillBadge>
              <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
                {t("home.contact.title")}
              </h2>
              <p className="text-sm leading-relaxed text-white md:text-base">
                {t("home.contact.intro")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
                <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
                  Alphadent
                </h3>
                <p className="text-sm text-brand-gold-muted">{CONTACT_INFO.address}</p>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
                <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
                  {t("home.contact.languagesLabel")}
                </h3>
                <p className="text-sm text-brand-gold-muted">{t("home.contact.languages")}</p>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
                <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
                  Telefon
                </h3>
                <div className="space-y-1">
                  <a
                    href={CONTACT_INFO.mobileHref}
                    className="block text-sm text-brand-gold hover:text-brand-gold-light"
                  >
                    {CONTACT_INFO.mobileDisplay}
                  </a>
                  <a
                    href={CONTACT_INFO.phoneMainHref}
                    className="block text-sm text-brand-gold hover:text-brand-gold-light"
                  >
                    {CONTACT_INFO.phoneMainDisplay}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
                <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
                  Email
                </h3>
                <a
                  href={CONTACT_INFO.emailHref}
                  className="text-sm text-brand-gold hover:text-brand-gold-light"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            <CtaButton href={kapcsolatHref} badge={t("nav.contact")} title={t("home.intro.ctaButton")} />
          </RevealSection>
        </PageContainer>
      </section>
    </>
  );
}
