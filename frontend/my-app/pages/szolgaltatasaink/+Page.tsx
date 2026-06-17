import React from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/ui/page-container";
import { ServiceModal } from "../../components/ui/service-modal";
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
  const [selectedKey, setSelectedKey] = React.useState<(typeof SERVICE_KEYS)[number] | null>(null);

  const selectedTitle = selectedKey ? t(`servicesPage.tiles.${selectedKey}`) : "";
  const selectedItems = selectedKey
    ? (t(`servicesPage.details.${selectedKey}`, { returnObjects: true }) as string[])
    : [];

  return (
    <PageContainer className="py-10 md:py-14">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICE_KEYS.map((key, index) => (
          <ServiceTile
            key={key}
            title={t(`servicesPage.tiles.${key}`)}
            delayMs={index * 60}
            onClick={() => setSelectedKey(key)}
            // TODO: ide jon majd a Cloudinary URL
            // imageUrl="https://res.cloudinary.com/<cloud>/image/upload/<id>.jpg"
          />
        ))}
      </section>

      <ServiceModal
        open={selectedKey !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKey(null);
        }}
        title={selectedTitle}
        items={selectedItems}
      />
    </PageContainer>
  );
}
