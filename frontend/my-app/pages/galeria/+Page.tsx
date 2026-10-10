import { Building2, Images, Palette, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { PhotoGrid } from "../../components/ui/photo-grid";
import { RevealGroup } from "../../components/ui/reveal-section";
import { GALLERY_SECTIONS, type GallerySectionKey } from "../../lib/gallery";
import { localizeHref } from "../../lib/locale";

export { Page };

const SECTION_ICONS: Record<GallerySectionKey, LucideIcon> = {
  clinic: Building2,
  lab: Palette,
};

const ICON_RING =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const sections = GALLERY_SECTIONS.filter((section) => section.photos.length > 0);

  return (
    <PageContainer className="space-y-14 py-10 md:space-y-20 md:py-14">
      <RevealGroup skip={1}>
        <header className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">{t("galleryPage.eyebrow")}</p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl">
            {t("galleryPage.title")}
          </h1>
          <p className="text-sm leading-relaxed text-white md:text-base">{t("galleryPage.intro")}</p>
        </header>

        {sections.map(({ key, photos }) => {
          const Icon = SECTION_ICONS[key];
          return (
            <section key={key} className="space-y-6">
              <div className="flex items-start gap-4">
                <span aria-hidden className={ICON_RING}>
                  <Icon className="size-5" />
                </span>
                <div className="max-w-3xl space-y-2">
                  <h2 className="text-xl font-semibold text-brand-gold-light md:text-2xl">
                    {t(`galleryPage.sections.${key}.title`)}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/90 md:text-base">
                    {t(`galleryPage.sections.${key}.text`)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
                    {t("galleryPage.photoCount", { count: photos.length })}
                  </p>
                </div>
              </div>
              <PhotoGrid photos={photos.map(({ src, altKey }) => ({ src, alt: t(altKey) }))} />
            </section>
          );
        })}

        {sections.length === 0 ? (
          <section className="flex flex-col items-start gap-5 rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.14),transparent_55%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-8">
            <span aria-hidden className={ICON_RING}>
              <Images className="size-5" />
            </span>
            <p className="max-w-2xl text-sm leading-relaxed text-white md:text-base">{t("galleryPage.comingSoon")}</p>
            <CtaButton href={localizeHref(locale, "/klinikank")} badge={t("galleryPage.eyebrow")} title={t("nav.clinic")} />
          </section>
        ) : null}
      </RevealGroup>
    </PageContainer>
  );
}
