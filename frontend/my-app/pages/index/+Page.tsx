import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Hero } from "../../components/ui/hero";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { localizeHref } from "../../lib/locale";
import { useReveal } from "../../lib/use-reveal";
import { cn } from "../../lib/utils";

export { Page };

const HERO_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp";

// Fade + float up, staggered across the heading/paragraph/CTA of the intro
// section below, triggered once that section scrolls into view. Deliberately
// not used in <Hero>: that's above the fold and already visible on first
// paint, so gating it behind a scroll observer would only add cost against
// Lighthouse without anything to gain.
const REVEAL_CLASS =
  "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const { ref: introRef, visible: introVisible } = useReveal<HTMLDivElement>();

  return (
    <>
      <Hero
        imageSrc={HERO_IMAGE}
        imageAlt="Alphadent"
        quote={t("home.hero.motto")}
        brandMark="Alphadent"
      />

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
            <div
              style={{ transitionDelay: "280ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "mt-2"
              )}
            >
              <CtaButton
                href={localizeHref(locale, "/kapcsolat")}
                badge={t("nav.contact")}
                title={t("home.intro.ctaButton")}
              />
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
