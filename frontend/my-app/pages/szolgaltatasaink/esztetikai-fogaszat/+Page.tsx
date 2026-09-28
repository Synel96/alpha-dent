import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { CtaButton } from "../../../components/ui/cta-button";
import { PageContainer } from "../../../components/ui/page-container";
import { ServiceImage } from "../../../components/ui/service-image";
import { localizeHref } from "../../../lib/locale";

export { Page };

const SMILE_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1790610784/file_00000000ea2481f4b11af39991847f2f_esa65q.png";

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const paragraphs = t("services.esztetikaiFogaszat.paragraphs", {
    returnObjects: true,
  }) as string[];
  const items = t("services.esztetikaiFogaszat.items", { returnObjects: true }) as string[];

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-12">
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
            {t("services.esztetikaiFogaszat.title")}
          </h1>
          <p className="text-lg italic leading-snug text-brand-gold-light/90">
            {t("services.esztetikaiFogaszat.tagline")}
          </p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-white md:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <ServiceImage
          src={SMILE_IMAGE}
          alt={t("services.esztetikaiFogaszat.imageAlt")}
        />
      </div>

      <section className="max-w-3xl space-y-3">
        <p className="text-sm text-white">
          {t("services.esztetikaiFogaszat.listIntro")}
        </p>
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

      <p className="max-w-3xl text-sm italic leading-relaxed text-white">
        {t("services.esztetikaiFogaszat.closing")}
      </p>

      <CtaButton
        href={localizeHref(locale, "/kapcsolat")}
        badge={t("nav.contact")}
        title={t("home.intro.ctaButton")}
      />
    </PageContainer>
  );
}
