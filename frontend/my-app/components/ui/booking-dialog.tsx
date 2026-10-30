import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CalendarCheck, Eraser, MailCheck, RotateCcw, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { bookingMailto, openMailto, signedBookingMessage } from "@/lib/booking";
import { CLINIC } from "@/lib/clinic-info";
import { localizeHref, type Locale } from "@/lib/locale";
import type { ServiceSlug } from "@/lib/service-cards";
import { cn } from "@/lib/utils";

// The appointment request modal behind every "Időpontot kérek" button: the
// visitor gives their name and phone number, edits the subject and the
// pre-written message, and "Tovább a küldéshez" opens their mail app with
// the e-mail ready, signed with the name and number unless they untick
// that (still no backend -
// see lib/booking.ts). The buttons keep their mailto: href, so without
// JavaScript (or with a modified click) they open the mail app directly.

type OpenBooking = (service?: ServiceSlug) => void;

const BookingContext = React.createContext<OpenBooking | null>(null);

export function BookingDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [service, setService] = React.useState<ServiceSlug | undefined>();
  // Remounts the form on every open, so it starts from the template again.
  const [session, setSession] = React.useState(0);

  const openBooking = React.useCallback<OpenBooking>((nextService) => {
    setService(nextService);
    setSession((value) => value + 1);
    setOpen(true);
  }, []);

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          {/* The overlay is the scroll container and the panel sits in normal
              flow inside it, rather than a fixed, translate-centred panel
              with its own scrollbar: when a phone's keyboard closes or the
              visitor comes back from the mail app, the viewport resizes and
              a centred panel jumps and repaints. No backdrop-filter either -
              phones re-rasterize a blurred backdrop slowly after returning
              from another app, which showed the panel's lower half late. */}
          <DialogPrimitive.Overlay className="lightbox-animate fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/85 px-4 py-6 [animation:lightbox-fade_200ms_ease-out] sm:items-center">
            <DialogPrimitive.Content className="relative w-full max-w-lg rounded-2xl border border-brand-gold/40 bg-brand-surface p-5 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] outline-none sm:p-6">
              <BookingForm key={session} service={service} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Overlay>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </BookingContext.Provider>
  );
}

const FIELD_CLASS =
  "w-full rounded-lg border border-brand-border bg-brand-black/60 px-3 py-2 text-sm text-white placeholder:text-brand-muted focus:border-brand-gold/70 focus:outline-none focus:ring-2 focus:ring-brand-gold-light/40";

const LABEL_CLASS = "text-xs uppercase tracking-[0.18em] text-brand-gold-muted";

const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-brand-gold/60 bg-brand-gold/15 px-5 py-3 text-sm font-semibold text-brand-gold-light transition-colors hover:border-brand-gold hover:bg-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

const TEXT_BUTTON_CLASS =
  "-mt-2 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-brand-gold-muted transition-colors hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl border border-brand-border px-5 py-2.5 text-sm text-brand-gold-muted transition-colors hover:border-brand-gold/50 hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70";

function BookingForm({ service }: { service?: ServiceSlug }) {
  const { t, i18n } = useTranslation();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  // Whether the name and number go at the end of the message (as its
  // signature); only then are the two fields required.
  const [includeContact, setIncludeContact] = React.useState(true);
  // Required: the e-mail can only be drafted once the privacy notice is
  // accepted (see section 3.3 of lib/privacy-policy.ts on this form).
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);
  const [subject, setSubject] = React.useState(() => t("booking.subject"));
  const template = t("booking.message", { service: service ? t(`services.${service}.nav`) : "" });
  const [message, setMessage] = React.useState(template);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  // After "Tovább a küldéshez" the form gives way to a short confirmation
  // (the fields keep their values, for "Vissza a szerkesztéshez"): that's
  // what the visitor sees on coming back from the mail app, and if no mail
  // app opened, it says how else to reach the clinic.
  const [sent, setSent] = React.useState(false);
  const mailtoHref = bookingMailto(
    subject,
    includeContact ? signedBookingMessage(message, name, phone, t("booking.dialog.phone")) : message
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Close the phone's keyboard first, so the page isn't resized again
    // while the mail app takes over.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setSent(true);
    openMailto(mailtoHref);
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <DialogHeader icon={MailCheck} title={t("booking.dialog.sentTitle")} description={t("booking.dialog.sentText")} />
        <a
          href={mailtoHref}
          className={cn(PRIMARY_BUTTON_CLASS, "w-full")}
        >
          <Send aria-hidden className="size-4" />
          {t("booking.dialog.reopen")}
        </a>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setSent(false)} className={SECONDARY_BUTTON_CLASS}>
            {t("booking.dialog.edit")}
          </button>
          <DialogPrimitive.Close asChild>
            <button type="button" className={SECONDARY_BUTTON_CLASS}>
              {t("booking.dialog.done")}
            </button>
          </DialogPrimitive.Close>
        </div>
        <ContactFallback />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader icon={CalendarCheck} title={t("booking.dialog.title")} description={t("booking.dialog.intro")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className={LABEL_CLASS}>{t("booking.dialog.name")}</span>
          <input
            type="text"
            required={includeContact}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={FIELD_CLASS}
          />
        </label>
        <label className="block space-y-1.5">
          <span className={LABEL_CLASS}>{t("booking.dialog.phone")}</span>
          <input
            type="tel"
            required={includeContact}
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <label className="-mt-1 flex cursor-pointer items-start gap-2.5 text-sm text-white/85">
        <input
          type="checkbox"
          checked={includeContact}
          onChange={(event) => setIncludeContact(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-gold"
        />
        {t("booking.dialog.includeContact")}
      </label>

      <label className="block space-y-1.5">
        <span className={LABEL_CLASS}>{t("booking.dialog.subject")}</span>
        <input
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={FIELD_CLASS}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={LABEL_CLASS}>{t("booking.dialog.message")}</span>
        <textarea
          ref={messageRef}
          required
          rows={8}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(FIELD_CLASS, "resize-y leading-relaxed")}
        />
      </label>

      {/* Clear the template to write an e-mail of one's own - or, once
          cleared, bring it back. */}
      {message.trim() ? (
        <button
          type="button"
          onClick={() => {
            setMessage("");
            messageRef.current?.focus();
          }}
          className={TEXT_BUTTON_CLASS}
        >
          <Eraser aria-hidden className="size-4" />
          {t(message === template ? "booking.dialog.clearMessage" : "booking.dialog.clearOwnMessage")}
        </button>
      ) : (
        <button type="button" onClick={() => setMessage(template)} className={TEXT_BUTTON_CLASS}>
          <RotateCcw aria-hidden className="size-4" />
          {t("booking.dialog.restoreMessage")}
        </button>
      )}

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-white/85">
        <input
          type="checkbox"
          required
          checked={privacyAccepted}
          onChange={(event) => setPrivacyAccepted(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-gold"
        />
        <span>
          {t("booking.dialog.privacyBefore")}
          {/* A new tab, so what's typed in here isn't lost. */}
          <a
            href={localizeHref(i18n.language as Locale, "/adatkezelesi-tajekoztato")}
            target="_blank"
            rel="noopener"
            className="text-brand-gold-light underline underline-offset-4 hover:text-brand-gold"
          >
            {t("booking.dialog.privacyLink")}
          </a>
          {t("booking.dialog.privacyAfter")}
        </span>
      </label>

      <p className="text-xs leading-relaxed text-white/70">{t("booking.dialog.hint")}</p>

      <button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "w-full")}>
        <Send aria-hidden className="size-4" />
        {t("booking.dialog.submit")}
      </button>

      <ContactFallback />
    </form>
  );
}

// Title, description and the close button, shared by the form and the
// confirmation that follows it.
function DialogHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-start gap-3 pr-8">
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/50 text-brand-gold-light"
        >
          <Icon className="size-5" />
        </span>
        <div>
          <DialogPrimitive.Title className="text-lg font-semibold text-brand-gold-light">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-sm leading-relaxed text-white/80">
            {description}
          </DialogPrimitive.Description>
        </div>
      </div>

      <DialogPrimitive.Close asChild>
        <button
          type="button"
          aria-label={t("common.lightbox.close")}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-brand-gold-muted transition-colors hover:bg-brand-black/50 hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
        >
          <X className="size-5" />
        </button>
      </DialogPrimitive.Close>
    </>
  );
}

function ContactFallback() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-xs leading-relaxed text-brand-gold-muted">
      {t("booking.dialog.fallback")}{" "}
      <a href={`tel:${CLINIC.phoneE164}`} className="whitespace-nowrap text-white underline-offset-4 hover:underline">
        {CLINIC.phoneDisplay}
      </a>{" "}
      ·{" "}
      <a href={`mailto:${CLINIC.email}`} className="whitespace-nowrap text-white underline-offset-4 hover:underline">
        {CLINIC.email}
      </a>
    </p>
  );
}

// href + onClick for an "Időpontot kérek" link: a plain click opens the
// modal; outside <BookingDialogProvider> (e.g. in page tests) or with a
// modifier key it stays an ordinary mailto: link.
export function useBookingCta(service?: ServiceSlug) {
  const { t } = useTranslation();
  const openBooking = React.useContext(BookingContext);
  const href = bookingMailto(
    t("booking.subject"),
    t("booking.body", { service: service ? t(`services.${service}.nav`) : "" })
  );

  const onClick = openBooking
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openBooking(service);
      }
    : undefined;

  return { href, onClick };
}
