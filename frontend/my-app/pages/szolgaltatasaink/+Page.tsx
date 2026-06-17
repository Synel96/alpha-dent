import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/ui/page-container";
import { ServiceTile } from "../../components/ui/service-tile";

const SERVICE_KEYS = [
  "consultingDiagnostic",
  "toothSaving",
  "implantPlacement",
  "oralSurgery",
  "crownsBridges",
  "mixedRemovable",
  "removable",
  "other",
] as const;

export { Page };

function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-10 md:py-14">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICE_KEYS.map((key, index) => (
          <ServiceTile
            key={key}
            title={t(`servicesPage.tiles.${key}`)}
            delayMs={index * 60}
            // TODO: ide jon majd a Cloudinary URL
            // imageUrl="https://res.cloudinary.com/<cloud>/image/upload/<id>.jpg"
          />
        ))}
      </section>
    </PageContainer>
  );
}
