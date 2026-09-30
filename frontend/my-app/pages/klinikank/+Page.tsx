import React from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { PhotoGrid, type GridPhoto } from "../../components/ui/photo-grid";
import { ServiceImage } from "../../components/ui/service-image";
import { cloudinarySrcSet, cloudinaryUrl } from "../../lib/cloudinary";
import { localizeHref } from "../../lib/locale";

export { Page };

const PANORAMA_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790500751/pano_crop_tlmpc3.webp";
const PANORAMA_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;
const WAITING_ROOM_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789381101/IMG_3397_gii27w.webp";
const CLINIC_IMAGES = [
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789381101/IMG_3396_vw5kcw.webp",
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789381101/IMG_3399_xpizts.webp",
];
const IMPLANT_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789221230/Alphadent_portfolio_0053_gz8nis.webp";

const MACHINE_PHOTOS: GridPhoto[] = [];
const LAB_WORK_PHOTOS: GridPhoto[] = [];

type Highlight = { value: string; label: string };

function Section({
  eyebrow,
  title,
  paragraphs,
  children,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">{eyebrow}</p>
        <h2 className="text-xl font-semibold text-brand-gold-light md:text-3xl">{title}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
            {paragraph}
          </p>
        ))}
      </div>
      {children}
    </section>
  );
}

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const list = (key: string) => t(key, { returnObjects: true }) as string[];

  const highlights = t("clinicPage.highlights", { returnObjects: true }) as Highlight[];
  const clinicPhotos: GridPhoto[] = [
    { src: WAITING_ROOM_IMAGE, alt: t("clinicPage.rooms.waitingRoomAlt") },
    ...CLINIC_IMAGES.map((src) => ({ src, alt: t("clinicPage.rooms.photoAlt") })),
  ];

  return (
    <PageContainer className="space-y-16 py-10 md:space-y-24 md:py-14">
      <header className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
            {t("clinicPage.eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl">
            {t("clinicPage.title")}
          </h1>
          <p className="text-sm leading-relaxed text-white md:text-base">{t("clinicPage.intro")}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li
              key={item.value}
              className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.14),transparent_55%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-5"
            >
              <p className="text-2xl font-semibold text-brand-gold-light md:text-3xl">{item.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{item.label}</p>
            </li>
          ))}
        </ul>
      </header>

      <Section
        eyebrow={t("clinicPage.rooms.eyebrow")}
        title={t("clinicPage.rooms.title")}
        paragraphs={list("clinicPage.rooms.paragraphs")}
      >
        <img
          src={cloudinaryUrl(PANORAMA_IMAGE, { width: 1280 })}
          srcSet={cloudinarySrcSet(PANORAMA_IMAGE, PANORAMA_IMAGE_WIDTHS)}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt={t("clinicPage.rooms.panoramaAlt")}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          className="aspect-[16/9] w-full rounded-2xl border border-brand-gold/25 object-cover shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)] sm:aspect-[21/9] lg:aspect-[3/1]"
        />
        <PhotoGrid photos={clinicPhotos} />
      </Section>

      <Section
        eyebrow={t("clinicPage.lab.eyebrow")}
        title={t("clinicPage.lab.title")}
        paragraphs={list("clinicPage.lab.paragraphs")}
      >
        <PhotoGrid photos={MACHINE_PHOTOS} columns={2} />
      </Section>

      <Section
        eyebrow={t("clinicPage.work.eyebrow")}
        title={t("clinicPage.work.title")}
        paragraphs={list("clinicPage.work.paragraphs")}
      >
        <PhotoGrid photos={LAB_WORK_PHOTOS} columns={2} />
      </Section>

      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
            {t("clinicPage.implants.eyebrow")}
          </p>
          <h2 className="text-xl font-semibold text-brand-gold-light md:text-3xl">
            {t("clinicPage.implants.title")}
          </h2>
          {list("clinicPage.implants.paragraphs").map((paragraph) => (
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
      </section>

      <section className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.16),transparent_45%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-10">
        <p className="max-w-3xl text-sm leading-relaxed text-white md:text-base">
          {t("clinicPage.closing.text")}
        </p>
        <p className="mt-4 max-w-3xl text-lg italic leading-snug text-brand-gold-light md:text-xl">
          {t("clinicPage.closing.quote")}
        </p>
        <div className="mt-6">
          <CtaButton
            href={localizeHref(locale, "/kapcsolat")}
            badge={t("nav.contact")}
            title={t("home.intro.ctaButton")}
          />
        </div>
      </section>
    </PageContainer>
  );
}
