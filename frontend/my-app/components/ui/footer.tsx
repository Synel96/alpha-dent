import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-brand-border bg-brand-black py-6 text-center text-sm text-brand-gold">
      <div className="mx-auto max-w-7xl px-6 tracking-wide">
        &copy; {new Date().getFullYear()} Alphadent Kft. -{" "}
        {t("footer.allRightsReserved")}
      </div>
    </footer>
  );
}
