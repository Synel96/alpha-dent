import { useTranslation } from "react-i18next";
import { Facebook, Instagram } from "lucide-react";

const SOCIAL_LINKS = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/alphadent_eu?stkn=M3doOGZmZXU2dWox",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589184814755",
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-brand-border bg-brand-black py-8 text-center text-sm text-brand-gold">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-center gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex items-center justify-center text-brand-gold-muted hover:text-brand-gold-light transition-colors"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
        <div className="tracking-wide">
          &copy; {new Date().getFullYear()} Alphadent Kft. -{" "}
          {t("footer.allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
