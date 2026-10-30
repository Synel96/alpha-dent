import React from "react";
import { Award, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { AutoGallery } from "../../components/ui/auto-gallery";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { RevealGroup } from "../../components/ui/reveal-section";
import { PhotoGrid, type GridPhoto } from "../../components/ui/photo-grid";
import { ServiceImage } from "../../components/ui/service-image";
import { CLINIC_PHOTOS } from "../../lib/clinic-photos";
import { GALLERY_SECTIONS } from "../../lib/gallery";
import { localizeHref } from "../../lib/locale";
import { useBookingMailto } from "../../lib/use-booking-mailto";

export { Page };

const IMPLANT_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789221230/Alphadent_portfolio_0053_gz8nis.webp";

const MACHINE_PHOTOS: GridPhoto[] = [];

// The dental-lab photos of the Galéria page, in the same order and with the
// same alt texts.
const LAB_PHOTOS = GALLERY_SECTIONS.find((section) => section.key === "lab")?.photos ?? [];

type Highlight = { value: string; label: string };

// Same order as clinicPage.highlights: since 1996, team, CAMLOG Gold.
const HIGHLIGHT_ICONS = [Building2, Users, Award] as const;

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
  const bookingHref = useBookingMailto();
  const { locale } = usePageContext();
  const list = (key: string) => t(key, { returnObjects: true }) as string[];

  const highlights = t("clinicPage.highlights", { returnObjects: true }) as Highlight[];
  const clinicPhotos: GridPhoto[] = CLINIC_PHOTOS.map(({ key, src }) => ({
    src,
    alt: t(`clinicPage.rooms.photos.${key}`),
  }));

  return (
    <PageContainer className="space-y-16 py-10 md:space-y-24 md:py-14">
      <RevealGroup skip={1}>
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

          <ul className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = HIGHLIGHT_ICONS[index];
              return (
                <li
                  key={item.value}
                  className="rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.14),transparent_55%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-5"
                >
                  {Icon ? (
                    <span
                      aria-hidden
                      className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light"
                    >
                      <Icon className="size-5" />
                    </span>
                  ) : null}
                  <p className="text-2xl font-semibold text-brand-gold-light md:text-3xl">{item.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{item.label}</p>
                </li>
              );
            })}
          </ul>
        </header>

        <Section
          eyebrow={t("clinicPage.rooms.eyebrow")}
          title={t("clinicPage.rooms.title")}
          paragraphs={list("clinicPage.rooms.paragraphs")}
        >
          <AutoGallery images={clinicPhotos} />
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
          <AutoGallery
            images={LAB_PHOTOS.map(({ src, altKey }) => ({ src, alt: t(altKey) }))}
          />
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
              href={bookingHref}
              badge={t("nav.contact")}
              title={t("home.intro.ctaButton")}
            />
          </div>
        </section>
      </RevealGroup>
    </PageContainer>
  );
}
