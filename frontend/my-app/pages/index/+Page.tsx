import {
  Award,
  Building2,
  Cpu,
  GalleryHorizontal,
  Gem,
  GraduationCap,
  Handshake,
  Layers,
  Phone,
  Puzzle,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { AutoGallery } from "../../components/ui/auto-gallery";
import { Hero } from "../../components/ui/hero";
import { OpenStatusCard } from "../../components/ui/open-status";
import { CtaButton, GHOST_BUTTON_CLASS } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { PillBadge } from "../../components/ui/pill-badge";
import { RevealSection } from "../../components/ui/reveal-section";
import { ServiceCarousel } from "../../components/ui/service-carousel";
import { ServiceTile } from "../../components/ui/service-tile";
import { CLINIC_PHOTOS } from "../../lib/clinic-photos";
import { CLINIC } from "../../lib/clinic-info";
import { localizeHref } from "../../lib/locale";
import { useBookingMailto } from "../../lib/use-booking-mailto";
import { SERVICE_IMAGES, SERVICE_PATHS, SERVICE_SLUGS } from "../../lib/service-cards";
import { useReveal } from "../../lib/use-reveal";
import { cn } from "../../lib/utils";

export { Page };

// The still shown while the hero video loads (and instead of it for reduced
// motion / data saver).
const HERO_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1792589308/Screenshot_20261021_152235419_jctcef.jpg";
const HERO_VIDEO =
  "https://res.cloudinary.com/dmwulp3dl/video/upload/v1792588721/HnVideoEditor_2026_10_21_151406270_jvppld.webm";

// One icon per "Miért Alphadent?" paragraph, in the same order as
// home.whyUs.paragraphs: since-1996 lab+clinic, experienced technicians /
// CAD-CAM, ongoing training, CAMLOG partnership.
const WHY_US_ICONS = [Building2, Cpu, GraduationCap, Handshake] as const;

// The 4 treatment types named in home.intro.description's first sentence:
// a single missing tooth, full dentures, oral surgery, aesthetic treatment.
const INTRO_ICONS = [Puzzle, Layers, Syringe, Gem] as const;

// Fade + float up, staggered across the heading/paragraph of the intro
// section below, triggered once that section scrolls into view. Deliberately
// not used in <Hero>: that's above the fold and already visible on first
// paint, so gating it behind a scroll observer would only add cost against
// Lighthouse without anything to gain.
const REVEAL_CLASS =
  "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();
  const { ref: introRef, visible: introVisible } = useReveal<HTMLDivElement>();

  const whyUsParagraphs = t("home.whyUs.paragraphs", { returnObjects: true }) as string[];
  const missionParagraphs = t("home.mission.paragraphs", { returnObjects: true }) as string[];

  const bookingHref = useBookingMailto();

  return (
    <>
      <Hero
        imageSrc={HERO_IMAGE}
        videoSrc={HERO_VIDEO}
        imageAlt="Alphadent"
        quote={t("home.hero.motto")}
        tagline={t("home.hero.since")}
        taglineIcon={ShieldCheck}
        brandMark={
          <>
            Alphadent{" "}
            <span aria-hidden className="hidden text-brand-gold-muted sm:inline">
              ·
            </span>{" "}
            <span className="block text-brand-gold-light/85 sm:inline">{t("home.hero.brandLine")}</span>
          </>
        }
        ctaHref={bookingHref}
        ctaLabel={t("home.intro.ctaButton")}
        secondaryAction={
          // Phones only: one tap to call. From md up the status card beside
          // the copy already has the number.
          <a href={`tel:${CLINIC.phoneE164}`} className={cn(GHOST_BUTTON_CLASS, "md:hidden")}>
            <Phone aria-hidden className="size-4" />
            {t("home.hero.call")}
          </a>
        }
        aside={<OpenStatusCard />}
      />

      {/* Intro */}
      <section className="relative overflow-hidden border-b border-brand-border bg-[radial-gradient(circle_at_50%_0%,rgba(228,196,106,0.08),transparent_55%)]">
        <PageContainer className="py-16 md:py-24">
          <div
            ref={introRef}
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          >
            <PillBadge
              icon={Sparkles}
              style={{ transitionDelay: "0ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              {t("home.intro.eyebrow")}
            </PillBadge>
            <h2
              style={{ transitionDelay: "140ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "text-2xl font-semibold leading-tight text-brand-gold-light md:text-4xl"
              )}
            >
              {t("home.intro.title")}
            </h2>
            <p
              style={{ transitionDelay: "280ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "max-w-2xl text-sm leading-relaxed text-white md:text-base"
              )}
            >
              {t("home.intro.description")}
            </p>
            <div
              style={{ transitionDelay: "420ms" }}
              className={cn(
                REVEAL_CLASS,
                introVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                "flex items-center gap-3"
              )}
            >
              {INTRO_ICONS.map((Icon, index) => (
                <span
                  key={index}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/30 text-brand-gold-light"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Services teaser */}
      <section className="border-b border-brand-border">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="space-y-8">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <PillBadge icon={Stethoscope}>{t("home.servicesTeaser.eyebrow")}</PillBadge>
              <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
                {t("home.servicesTeaser.title")}
              </h2>
            </div>

            <ServiceCarousel>
              {SERVICE_SLUGS.map((key, index) => (
                <ServiceTile
                  key={key}
                  title={t(`services.${key}.nav`)}
                  href={localizeHref(locale, SERVICE_PATHS[key])}
                  imageUrl={SERVICE_IMAGES[key]}
                  delayMs={index * 60}
                  className="w-[80%] shrink-0 snap-start sm:w-[48%] lg:w-[34%] xl:w-[27%]"
                  sizes="(min-width: 1280px) 330px, (min-width: 1024px) 34vw, (min-width: 640px) 48vw, 80vw"
                />
              ))}
            </ServiceCarousel>

            <div className="text-center">
              <a
                href={localizeHref(locale, "/szolgaltatasaink")}
                className="text-sm text-brand-gold-muted underline underline-offset-4 hover:text-brand-gold"
              >
                {t("home.servicesTeaser.moreLink")} →
              </a>
            </div>
          </RevealSection>
        </PageContainer>
      </section>

      {/* Miert Alphadent? */}
      <section className="border-b border-brand-border">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-4">
            <PillBadge icon={Award}>{t("home.whyUs.eyebrow")}</PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.whyUs.title")}
            </h2>
            {whyUsParagraphs.map((paragraph, index) => {
              const Icon = WHY_US_ICONS[index] ?? Award;
              return (
                <div key={paragraph} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/30 text-brand-gold-light">
                    <Icon className="size-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-white md:text-base">{paragraph}</p>
                </div>
              );
            })}
            <p className="text-sm italic leading-relaxed text-brand-gold-muted">
              {t("home.whyUs.closing")}
            </p>
          </RevealSection>
        </PageContainer>
      </section>

      {/* Gallery */}
      <section className="border-b border-brand-border bg-brand-surface/30 py-14 md:py-20">
        <PageContainer>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <PillBadge icon={GalleryHorizontal} className="mx-auto">
              {t("home.gallery.eyebrow")}
            </PillBadge>
          </div>
        </PageContainer>
        <AutoGallery
          images={CLINIC_PHOTOS.map(({ key, src }) => ({ src, alt: t(`clinicPage.rooms.photos.${key}`) }))}
        />
      </section>

      {/* Mission */}
      <section className="border-b border-brand-border bg-brand-surface/40">
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-3xl space-y-4 text-center">
            <PillBadge icon={Smile}>{t("home.mission.eyebrow")}</PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.mission.title")}
            </h2>
            {missionParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
                {paragraph}
              </p>
            ))}
          </RevealSection>
        </PageContainer>
      </section>

      {/* Contact teaser */}
      <section>
        <PageContainer className="py-14 md:py-20">
          <RevealSection className="mx-auto max-w-2xl space-y-4 text-center">
            <PillBadge icon={Phone} className="mx-auto">
              {t("nav.contact")}
            </PillBadge>
            <h2 className="text-2xl font-semibold text-brand-gold-light md:text-3xl">
              {t("home.contact.title")}
            </h2>
            <p className="text-sm leading-relaxed text-white md:text-base">
              {t("home.contact.intro")}
            </p>
            <div className="pt-2">
              <CtaButton
                href={bookingHref}
                badge={t("nav.contact")}
                title={t("home.intro.ctaButton")}
              />
            </div>
          </RevealSection>
        </PageContainer>
      </section>
    </>
  );
}
