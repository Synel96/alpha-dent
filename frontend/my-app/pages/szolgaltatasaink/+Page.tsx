import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { PageContainer } from "../../components/ui/page-container";
import { ServiceTile } from "../../components/ui/service-tile";
import { localizeHref } from "../../lib/locale";

export { Page };

const SERVICE_SLUGS = [
  "implantologia",
  "szajsebeszet",
  "esztetikaiFogaszat",
  "fogmegtartoKezelesek",
] as const;

const SERVICE_PATHS: Record<(typeof SERVICE_SLUGS)[number], string> = {
  implantologia: "/szolgaltatasaink/implantologia",
  szajsebeszet: "/szolgaltatasaink/szajsebeszet",
  esztetikaiFogaszat: "/szolgaltatasaink/esztetikai-fogaszat",
  fogmegtartoKezelesek: "/szolgaltatasaink/fogmegtarto-kezelesek",
};

const SERVICE_IMAGES: Partial<Record<(typeof SERVICE_SLUGS)[number], string>> = {
  implantologia: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789208024/IMG_3400_dsepbw.webp",
  szajsebeszet: "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789215806/IMG_3398_dmrstv.webp",
};

type ToolkitItem = { title: string; text: string };

function Page() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  const toolkitItems = t("servicesHub.toolkitItems", { returnObjects: true }) as ToolkitItem[];

  return (
    <PageContainer className="py-10 md:py-14 space-y-10 md:space-y-14">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
          {t("servicesHub.eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-brand-gold-light md:text-4xl">
          {t("servicesHub.title")}
        </h1>
        <p className="text-sm leading-relaxed text-brand-gold-muted md:text-base">
          {t("servicesHub.intro")}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_SLUGS.map((key, index) => (
          <ServiceTile
            key={key}
            title={t(`services.${key}.nav`)}
            href={localizeHref(locale, SERVICE_PATHS[key])}
            imageUrl={SERVICE_IMAGES[key]}
            delayMs={index * 60}
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-semibold text-brand-gold-light md:text-2xl">
            {t("servicesHub.toolkitTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-brand-gold-muted md:text-base">
            {t("servicesHub.toolkitIntro")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolkitItems.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-brand-border bg-brand-surface/60 p-5"
            >
              <h3 className="mb-2 text-sm uppercase tracking-[0.15em] text-brand-gold-light">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-gold-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
