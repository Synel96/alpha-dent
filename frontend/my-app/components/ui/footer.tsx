import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { localizeHref } from "@/lib/locale";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/alphadent_eu?stkn=M3doOGZmZXU2dWox",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const PAGE_LINKS = [
  { labelKey: "nav.home", path: "/" },
  { labelKey: "nav.clinic", path: "/klinikank" },
  { labelKey: "nav.services", path: "/szolgaltatasaink" },
  { labelKey: "nav.gallery", path: "/galeria" },
  { labelKey: "nav.faq", path: "/kerdesek" },
  { labelKey: "nav.contact", path: "/kapcsolat" },
];

const SERVICE_LINKS = [
  { labelKey: "services.implantologia.nav", path: "/szolgaltatasaink/implantologia" },
  { labelKey: "services.szajsebeszet.nav", path: "/szolgaltatasaink/szajsebeszet" },
  { labelKey: "services.esztetikaiFogaszat.nav", path: "/szolgaltatasaink/esztetikai-fogaszat" },
  { labelKey: "services.fogmegtartoKezelesek.nav", path: "/szolgaltatasaink/fogmegtarto-kezelesek" },
];

const HEADING = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light";
const LINK = "text-sm text-white/80 transition-colors hover:text-brand-gold-light";

export function Footer() {
  const { t } = useTranslation();
  const { locale } = usePageContext();

  return (
    <footer className="border-t border-brand-border bg-brand-black/80 backdrop-blur-sm text-brand-gold">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <a
            href={localizeHref(locale, "/")}
            className="text-lg font-semibold uppercase tracking-[0.32em] text-brand-gold transition-colors hover:text-brand-gold-light"
          >
            Alphadent
          </a>
          <div className="mt-5 flex items-center gap-4">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="inline-flex items-center justify-center text-brand-gold-muted transition-colors hover:text-brand-gold-light"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label={t("footer.pages")}>
          <h2 className={HEADING}>{t("footer.pages")}</h2>
          <ul className="space-y-2.5">
            {PAGE_LINKS.map(({ labelKey, path }) => (
              <li key={path}>
                <a href={localizeHref(locale, path)} className={LINK}>
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("nav.services")}>
          <h2 className={HEADING}>{t("nav.services")}</h2>
          <ul className="space-y-2.5">
            {SERVICE_LINKS.map(({ labelKey, path }) => (
              <li key={path}>
                <a href={localizeHref(locale, path)} className={LINK}>
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={HEADING}>{t("contactPage.eyebrow")}</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden className="size-4 shrink-0 text-brand-gold-muted" />
              <a href="tel:+36208080600" className={LINK}>
                +36 20 80 80 600
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0 text-brand-gold-muted" />
              <a href="mailto:info@alpha-dent.eu" className={LINK}>
                info@alpha-dent.eu
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-gold-muted" />
              <a
                href="https://goo.gl/maps/tBZd2pfrPTJkpJVb6"
                target="_blank"
                rel="noreferrer"
                className={LINK}
              >
                9400 Sopron, Arany János u. 13.
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-brand-border px-6 py-5 text-center text-xs tracking-wide text-brand-gold-muted sm:flex-row sm:justify-center sm:gap-4">
        <span>
          &copy; {new Date().getFullYear()} Alphadent Kft. - {t("footer.allRightsReserved")}
        </span>
        <a
          href={localizeHref(locale, "/adatkezelesi-tajekoztato")}
          className="transition-colors hover:text-brand-gold-light"
        >
          {t("privacyPage.title")}
        </a>
      </div>
    </footer>
  );
}
