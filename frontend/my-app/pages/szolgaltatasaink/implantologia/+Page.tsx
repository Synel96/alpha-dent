import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { AutoGallery } from "../../../components/ui/auto-gallery";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { RevealGroup } from "../../../components/ui/reveal-section";
import { ServiceImage } from "../../../components/ui/service-image";
import { LAB_CRAFT_IMAGES } from "../../../lib/lab-gallery";
import { localizeHref } from "../../../lib/locale";

export { Page };

const IMPLANT_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789221230/Alphadent_portfolio_0053_gz8nis.webp";

type Item = { title: string; text: string };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const cases = t("services.implantologia.cases", { returnObjects: true }) as Item[];
  const steps = t("services.implantologia.steps", { returnObjects: true }) as Item[];
  const paragraphs = t("services.implantologia.paragraphs", { returnObjects: true }) as string[];

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
              {t("services.implantologia.title")}
            </h1>
            <p className="text-lg italic leading-snug text-brand-gold-light/90">
              {t("services.implantologia.tagline")}
            </p>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <ServiceImage
            src={IMPLANT_IMAGE}
            alt={t("services.implantologia.imageAlt")}
            caption={t("services.implantologia.imageCaption")}
          />
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {cases.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-brand-gold/25 bg-brand-surface/60 p-5"
            >
              <h3 className="mb-2 text-sm uppercase tracking-[0.15em] text-brand-gold-light">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-white">{item.text}</p>
            </article>
          ))}
        </section>

        <p className="max-w-3xl text-sm italic leading-relaxed text-white">
          {t("services.implantologia.closing")}
        </p>

        {LAB_CRAFT_IMAGES.length > 0 ? (
          <section>
            <h2 className="mb-5 flex items-center gap-3 text-xl font-semibold text-brand-gold-light md:text-2xl">
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light"
              >
                <Palette className="size-5" />
              </span>
              {t("services.implantologia.galleryTitle")}
            </h2>
            <AutoGallery
              images={LAB_CRAFT_IMAGES.map((src) => ({ src, alt: t("services.implantologia.galleryImageAlt") }))}
            />
          </section>
        ) : null}

        <section>
          <h2 className="mb-5 text-xl font-semibold text-brand-gold-light md:text-2xl">
            {t("services.implantologia.processTitle")}
          </h2>
          <ol className="space-y-4">
            {steps.map((step) => (
              <li
                key={step.title}
                className="rounded-xl border border-brand-gold/25 bg-brand-surface/40 p-4"
              >
                <h3 className="text-sm font-semibold text-brand-gold-light">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white">{step.text}</p>
              </li>
            ))}
          </ol>
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
