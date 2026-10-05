import { Check, Hand, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { ZoomableImage } from "../../../components/ui/lightbox";
import { cloudinarySrcSet, cloudinaryUrl } from "../../../lib/cloudinary";
import { PageContainer } from "../../../components/ui/page-container";
import { localizeHref } from "../../../lib/locale";

export { Page };

const PANORAMA_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790500751/pano_crop_tlmpc3.webp";

const PANORAMA_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;

// Same order as services.szajsebeszet.comfort: anaesthesia, explanation, hand signal, aftercare.
const COMFORT_ICONS = [ShieldCheck, MessageCircle, Hand, HeartHandshake] as const;

type ComfortItem = { title: string; text: string };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const items = t("services.szajsebeszet.items", { returnObjects: true }) as string[];
  const comfort = t("services.szajsebeszet.comfort", { returnObjects: true }) as ComfortItem[];

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
      <ZoomableImage image={{ src: PANORAMA_IMAGE, alt: t("services.szajsebeszet.imageAlt") }}>
        <img
          src={cloudinaryUrl(PANORAMA_IMAGE, { width: 1280 })}
          srcSet={cloudinarySrcSet(PANORAMA_IMAGE, PANORAMA_IMAGE_WIDTHS)}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt={t("services.szajsebeszet.imageAlt")}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          className="aspect-[16/9] w-full rounded-2xl border border-brand-gold/25 object-cover shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)] sm:aspect-[21/9] lg:aspect-[3/1]"
        />
      </ZoomableImage>

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

      <section className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.16),transparent_45%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-8">
        <h2 className="text-xl font-semibold text-brand-gold-light md:text-2xl">
          {t("services.szajsebeszet.comfortTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white md:text-base">
          {t("services.szajsebeszet.comfortIntro")}
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {comfort.map((item, index) => {
            const Icon = COMFORT_ICONS[index];
            return (
              <div key={item.title} className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/30 text-brand-gold-light">
                  {Icon ? <Icon aria-hidden className="size-4" /> : null}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-brand-gold-light md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
