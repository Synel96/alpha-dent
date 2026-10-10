import React from "react";
import { Building2, Images, Palette, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { PhotoGrid } from "../../components/ui/photo-grid";
import { RevealGroup } from "../../components/ui/reveal-section";
import { GALLERY_SECTIONS, type GallerySection, type GallerySectionKey } from "../../lib/gallery";
import { localizeHref } from "../../lib/locale";
import { cn } from "../../lib/utils";

export { Page };

const SECTION_ICONS: Record<GallerySectionKey, LucideIcon> = {
  clinic: Building2,
  lab: Palette,
};

// The URL hash that opens a tab, e.g. /hu/galeria#labor - the same in every
// language, so other pages can deep-link to a category.
const SECTION_HASHES: Record<GallerySectionKey, string> = {
  clinic: "rendelo",
  lab: "labor",
};

const ICON_RING =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-brand-gold-light";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  // Memoized: GalleryTabs' hash listener depends on it.
  const sections = React.useMemo(() => GALLERY_SECTIONS.filter((section) => section.photos.length > 0), []);

  return (
    <PageContainer className="space-y-10 py-10 md:space-y-12 md:py-14">
      <RevealGroup skip={1}>
        <header className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">{t("galleryPage.eyebrow")}</p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl">
            {t("galleryPage.title")}
          </h1>
          <p className="text-sm leading-relaxed text-white md:text-base">{t("galleryPage.intro")}</p>
        </header>

        {sections.length > 1 ? (
          <GalleryTabs sections={sections} />
        ) : sections.length === 1 ? (
          <SectionPanel section={sections[0]} showCount />
        ) : (
          <section className="flex flex-col items-start gap-5 rounded-2xl border border-brand-gold/25 bg-[radial-gradient(circle_at_10%_0%,rgba(228,196,106,0.14),transparent_55%),linear-gradient(140deg,rgba(17,17,20,0.96),rgba(8,8,10,0.96))] p-6 md:p-8">
            <span aria-hidden className={ICON_RING}>
              <Images className="size-5" />
            </span>
            <p className="max-w-2xl text-sm leading-relaxed text-white md:text-base">{t("galleryPage.comingSoon")}</p>
            <CtaButton href={localizeHref(locale, "/klinikank")} badge={t("galleryPage.eyebrow")} title={t("nav.clinic")} />
          </section>
        )}
      </RevealGroup>
    </PageContainer>
  );
}

function sectionFromHash(sections: GallerySection[]): GallerySectionKey | null {
  const hash = window.location.hash.slice(1);
  return sections.find((section) => SECTION_HASHES[section.key] === hash)?.key ?? null;
}

// WAI-ARIA tabs: one category's photos at a time, so the page stays short on
// a phone. Every panel is in the prerendered HTML (the inactive ones just
// hidden), and the hidden panels' lazy images don't load until opened.
function GalleryTabs({ sections }: { sections: GallerySection[] }) {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<GallerySectionKey>(sections[0].key);
  const tabRefs = React.useRef<Partial<Record<GallerySectionKey, HTMLButtonElement | null>>>({});

  // Opens the tab named in the URL hash, on load and on in-page hash links.
  React.useEffect(() => {
    const sync = () => {
      const key = sectionFromHash(sections);
      if (key) setActive(key);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sections]);

  const select = (key: GallerySectionKey) => {
    setActive(key);
    // replaceState: switching tabs shouldn't pile up history entries or
    // scroll the page. Keeps the router's own history state.
    window.history.replaceState(window.history.state, "", `#${SECTION_HASHES[key]}`);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % sections.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + sections.length) % sections.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = sections.length - 1;
    else return;
    event.preventDefault();
    const key = sections[next].key;
    select(key);
    tabRefs.current[key]?.focus();
  };

  return (
    <div className="space-y-8">
      <div
        role="tablist"
        aria-label={t("galleryPage.tabsLabel")}
        className="grid grid-cols-2 gap-2 sm:inline-grid sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none sm:gap-3"
      >
        {sections.map(({ key, photos }, index) => {
          const Icon = SECTION_ICONS[key];
          const selected = key === active;
          return (
            <button
              key={key}
              ref={(element) => {
                tabRefs.current[key] = element;
              }}
              type="button"
              role="tab"
              id={`galeria-tab-${key}`}
              aria-selected={selected}
              aria-controls={`galeria-panel-${key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70 sm:px-5 md:text-base",
                selected
                  ? "border-brand-gold-light/70 bg-brand-gold/15 text-brand-gold-light"
                  : "border-white/15 text-white/75 hover:border-brand-gold/50 hover:text-brand-gold-light"
              )}
            >
              <Icon aria-hidden className="hidden size-4 shrink-0 sm:block" />
              <span className="text-balance text-center leading-tight">{t(`galleryPage.sections.${key}.title`)}</span>
              <span
                aria-hidden
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  selected ? "bg-brand-gold-light/20 text-brand-gold-light" : "bg-white/10 text-white/70"
                )}
              >
                {photos.length}
              </span>
              <span className="sr-only">, {t("galleryPage.photoCount", { count: photos.length })}</span>
            </button>
          );
        })}
      </div>

      {sections.map((section) => (
        <div
          key={section.key}
          role="tabpanel"
          id={`galeria-panel-${section.key}`}
          aria-labelledby={`galeria-tab-${section.key}`}
          hidden={section.key !== active}
        >
          <SectionPanel section={section} />
        </div>
      ))}
    </div>
  );
}

function SectionPanel({ section, showCount = false }: { section: GallerySection; showCount?: boolean }) {
  const { t } = useTranslation();
  const { key, photos } = section;
  const Icon = SECTION_ICONS[key];

  return (
    <section className="space-y-6">
      <div className="flex items-start gap-4">
        <span aria-hidden className={ICON_RING}>
          <Icon className="size-5" />
        </span>
        <div className="max-w-3xl space-y-2">
          <h2 className="text-xl font-semibold text-brand-gold-light md:text-2xl">
            {t(`galleryPage.sections.${key}.title`)}
          </h2>
          <p className="text-sm leading-relaxed text-white/90 md:text-base">{t(`galleryPage.sections.${key}.text`)}</p>
          {showCount ? (
            <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
              {t("galleryPage.photoCount", { count: photos.length })}
            </p>
          ) : null}
        </div>
      </div>
      <PhotoGrid photos={photos.map(({ src, altKey }) => ({ src, alt: t(altKey) }))} />
    </section>
  );
}
