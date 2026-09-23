import { useTranslation } from "react-i18next";

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

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-brand-border bg-brand-black/80 backdrop-blur-sm py-8 text-center text-sm text-brand-gold">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-center gap-4">
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
        <div className="tracking-wide">
          &copy; {new Date().getFullYear()} Alphadent Kft. -{" "}
          {t("footer.allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
