import { useTranslation } from "react-i18next";
import { CtaButton } from "../../components/ui/cta-button";
import { PageContainer } from "../../components/ui/page-container";
import { TextImageReveal } from "../../components/ui/text-image-reveal";

const CONTACT_INFO = {
  address: "9400 Sopron, Arany János u. 13.",
  mapUrl: "https://goo.gl/maps/tBZd2pfrPTJkpJVb6",
  mobileDisplay: "+36 20 80 80 600",
  mobileHref: "tel:+36208080600",
  phoneMainDisplay: "+36 99 788 888",
  phoneMainHref: "tel:+3699788888",
  phoneAltDisplay: "+36 99 340 707",
  phoneAltHref: "tel:+3699340707",
  email: "info@alpha-dent.eu",
  emailHref: "mailto:info@alpha-dent.eu",
  gps: "47.6777786, 16.5896789",
  gpsMapUrl: "https://www.google.com/maps?q=47.6777786,16.5896789",
  websiteUrl: "https://alpha-dent.eu/hu/",
} as const;

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/alphadent_eu?stkn=M3doOGZmZXU2dWox",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 1.5h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 1.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589184814755",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export { Page };

function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
      <TextImageReveal
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        description={t("contactPage.intro")}
        imageSrc="https://res.cloudinary.com/dmwulp3dl/image/upload/v1789381101/IMG_3395_ba4hbc.webp"
        imageAlt={t("contactPage.imageAlt")}
      >
        <div className="flex flex-wrap gap-3">
          <CtaButton
            href={CONTACT_INFO.mapUrl}
            target="_blank"
            rel="noreferrer"
            badge={t("contactPage.cards.address")}
            title={t("contactPage.actions.openMap")}
            subtitle={CONTACT_INFO.address}
            className="min-w-[280px]"
          />
          <CtaButton
            href={CONTACT_INFO.mobileHref}
            badge={t("contactPage.cards.mobile")}
            title={t("contactPage.actions.callNow")}
            subtitle={CONTACT_INFO.mobileDisplay}
            className="min-w-[260px]"
          />
          <CtaButton
            href={CONTACT_INFO.emailHref}
            badge={t("contactPage.cards.email")}
            title={t("contactPage.actions.sendEmail")}
            subtitle={CONTACT_INFO.email}
            className="min-w-[260px]"
          />
        </div>
      </TextImageReveal>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.address")}
          </h3>
          <p className="mb-3 text-sm text-white">{CONTACT_INFO.address}</p>
          <a
            href={CONTACT_INFO.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white hover:text-brand-gold-light"
          >
            {t("contactPage.actions.openMap")}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.mobile")}
          </h3>
          <a
            href={CONTACT_INFO.mobileHref}
            className="text-sm text-white hover:text-brand-gold-light"
          >
            {CONTACT_INFO.mobileDisplay}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.phone")}
          </h3>
          <div className="space-y-2">
            <a
              href={CONTACT_INFO.phoneMainHref}
              className="block text-sm text-white hover:text-brand-gold-light"
            >
              {CONTACT_INFO.phoneMainDisplay}
            </a>
            <a
              href={CONTACT_INFO.phoneAltHref}
              className="block text-sm text-white hover:text-brand-gold-light"
            >
              {CONTACT_INFO.phoneAltDisplay}
            </a>
          </div>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.email")}
          </h3>
          <a
            href={CONTACT_INFO.emailHref}
            className="text-sm text-white hover:text-brand-gold-light"
          >
            {CONTACT_INFO.email}
          </a>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.languages")}
          </h3>
          <p className="text-sm text-white">{t("contactPage.languages")}</p>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.gps")}
          </h3>
          <p className="mb-3 text-sm text-white">{CONTACT_INFO.gps}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={CONTACT_INFO.gpsMapUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white hover:text-brand-gold-light"
            >
              {t("contactPage.actions.openByGps")}
            </a>
            <a
              href={CONTACT_INFO.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white hover:text-brand-gold-light"
            >
              {t("contactPage.actions.openWebsite")}
            </a>
          </div>
        </article>

        <article className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
          <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-brand-gold-light">
            {t("contactPage.cards.social")}
          </h3>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex items-center justify-center text-brand-gold-muted hover:text-brand-gold-light transition-colors"
                title={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </article>
      </section>
    </PageContainer>
  );
}
