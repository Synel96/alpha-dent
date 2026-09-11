import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { Hero } from "../../components/ui/hero";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { localizeHref } from "../../lib/locale";

export { Page };

const HERO_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

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
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl">
              {t("home.intro.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-brand-gold-muted md:text-base">
              {t("home.intro.description")}
            </p>
            <CtaButton
              href={localizeHref(locale, "/kapcsolat")}
              badge={t("nav.contact")}
              title={t("home.intro.ctaButton")}
              className="mt-2"
            />
          </div>
        </PageContainer>
      </section>
    </>
  );
}
