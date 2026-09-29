import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/ui/page-container";

export { Page };

const EMAIL = "info@alpha-dent.eu";

function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold text-brand-gold-light md:text-4xl">
          {t("privacyPage.title")}
        </h1>
        <p className="text-sm leading-relaxed text-white md:text-base">
          {t("privacyPage.placeholder")}{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-gold-light underline-offset-4 hover:underline">
            {EMAIL}
          </a>
        </p>
      </div>
    </PageContainer>
  );
}
