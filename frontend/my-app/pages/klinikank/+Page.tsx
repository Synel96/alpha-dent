import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/ui/page-container";
import { TextImageReveal } from "../../components/ui/text-image-reveal";

export { Page };

function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-10 md:py-14">
      <TextImageReveal
        eyebrow={t("common.comingSoon.eyebrow")}
        title={t("nav.clinic")}
        description={t("common.comingSoon.description")}
      />
    </PageContainer>
  );
}
