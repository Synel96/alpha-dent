import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { cloudinarySrcSet, cloudinaryUrl } from "../../../lib/cloudinary";
import { PageContainer } from "../../../components/ui/page-container";
import { localizeHref } from "../../../lib/locale";

export { Page };

const PANORAMA_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790500751/pano_crop_tlmpc3.webp";

const PANORAMA_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const items = t("services.szajsebeszet.items", { returnObjects: true }) as string[];

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
          {t("services.szajsebeszet.title")}
        </h1>
        <p className="text-lg italic leading-snug text-brand-gold-light/90">
          {t("services.szajsebeszet.tagline")}
        </p>
        <p className="text-sm leading-relaxed text-white md:text-base">
          {t("services.szajsebeszet.intro")}
        </p>
      </div>

      {/* Fixed aspect per breakpoint (not the image's own) so there's no layout
          shift; on phones a full panorama would be only ~120px tall. */}
      <figure className="overflow-hidden rounded-2xl border border-brand-gold/25 shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)]">
        <img
          src={cloudinaryUrl(PANORAMA_IMAGE, { width: 1280 })}
          srcSet={cloudinarySrcSet(PANORAMA_IMAGE, PANORAMA_IMAGE_WIDTHS)}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt={t("services.szajsebeszet.imageAlt")}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          className="aspect-[16/9] w-full object-cover sm:aspect-[21/9] lg:aspect-[3/1]"
        />
      </figure>

      <section className="max-w-3xl space-y-3">
        <p className="text-sm text-white">{t("services.szajsebeszet.listIntro")}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-md border border-brand-gold/25 bg-brand-surface/55 px-3 py-2 text-sm leading-relaxed text-white"
            >
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-gold-light" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
