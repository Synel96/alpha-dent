import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { RevealGroup } from "../../../components/ui/reveal-section";
import { ServiceImage } from "../../../components/ui/service-image";
import { localizeHref } from "../../../lib/locale";

export { Page };

// VDW Raypex 6 apex locator, used for precise root canal treatment.
const APEX_LOCATOR_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1792599192/file_000000009df081f4ba4fcf9374c1c1ee_v5ffwt.webp";
// VDW BeeFill 2in1, the warm gutta-percha unit that seals the root canal.
const OBTURATION_IMAGE = "https://res.cloudinary.com/dmwulp3dl/image/upload/v1792765233/1792764991338_xftmqb.webp";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const paragraphs = t("services.fogmegtartoKezelesek.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <RevealGroup skip={2}>
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
            src={APEX_LOCATOR_IMAGE}
            alt={t("services.fogmegtartoKezelesek.imageAlt")}
          />
        </div>

        {/* Image first from md up, so the two blocks alternate sides. */}
        <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-4 md:order-2">
            <h2 className="text-xl font-semibold text-brand-gold-light md:text-2xl">
              {t("services.fogmegtartoKezelesek.obturation.title")}
            </h2>
            <p className="text-sm leading-relaxed text-white md:text-base">
              {t("services.fogmegtartoKezelesek.obturation.text")}
            </p>
          </div>
          <div className="md:order-1">
            <ServiceImage
              src={OBTURATION_IMAGE}
              alt={t("services.fogmegtartoKezelesek.obturation.imageAlt")}
            />
          </div>
        </section>

        <CtaButton
          href={localizeHref(locale, "/kapcsolat")}
          badge={t("nav.contact")}
          title={t("home.intro.ctaButton")}
        />
      </RevealGroup>
    </PageContainer>
  );
}
