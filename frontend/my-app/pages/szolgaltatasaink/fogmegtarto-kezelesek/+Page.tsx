import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { ServiceImage } from "../../../components/ui/service-image";
import { localizeHref } from "../../../lib/locale";

export { Page };

const HYGIENE_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790519995/file_0000000054fc82109139ba990ae6dd0a_hdjdtl.png";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const paragraphs = t("services.fogmegtartoKezelesek.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <a
        href={localizeHref(locale, "/szolgaltatasaink")}
        className="text-sm text-brand-gold-muted hover:text-brand-gold"
      >
        ← {t("servicesHub.title")}
      </a>

      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
            {t("nav.services")}
          </p>
          <h1 className="text-2xl font-semibold text-brand-gold-light md:text-4xl">
            {t("services.fogmegtartoKezelesek.title")}
          </h1>
          <p className="text-lg italic leading-snug text-brand-gold-light/90">
            {t("services.fogmegtartoKezelesek.tagline")}
          </p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <ServiceImage
          src={HYGIENE_IMAGE}
          alt={t("services.fogmegtartoKezelesek.imageAlt")}
        />
      </div>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
