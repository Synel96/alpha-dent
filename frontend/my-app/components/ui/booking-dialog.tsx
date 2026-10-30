import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CalendarCheck, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { bookingMailto, openMailto } from "@/lib/booking";
import { CLINIC } from "@/lib/clinic-info";
import type { ServiceSlug } from "@/lib/service-cards";
import { cn } from "@/lib/utils";

// The appointment request modal behind every "Időpontot kérek" button: the
// visitor edits the subject and the pre-written message here, and "Tovább a
// küldéshez" opens their mail app with both filled in (still no backend -
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
          <DialogPrimitive.Overlay className="lightbox-animate fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm [animation:lightbox-fade_200ms_ease-out]" />
          <DialogPrimitive.Content className="lightbox-animate fixed left-1/2 top-1/2 z-[61] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-brand-gold/40 bg-brand-surface p-5 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] outline-none [animation:lightbox-fade_200ms_ease-out] sm:p-6">
            <BookingForm key={session} service={service} />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </BookingContext.Provider>
  );
}

const FIELD_CLASS =
  "w-full rounded-lg border border-brand-border bg-brand-black/60 px-3 py-2 text-sm text-white placeholder:text-brand-muted focus:border-brand-gold/70 focus:outline-none focus:ring-2 focus:ring-brand-gold-light/40";

function BookingForm({ service }: { service?: ServiceSlug }) {
  const { t } = useTranslation();
  const [subject, setSubject] = React.useState(() => t("booking.subject"));
  const [message, setMessage] = React.useState(() =>
    t("booking.body", { service: service ? t(`services.${service}.nav`) : "" })
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The modal stays open: if no mail app opens, the text isn't lost and
    // the phone number and address below are still in view.
    openMailto(bookingMailto(subject, message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3 pr-8">
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/50 text-brand-gold-light"
        >
          <CalendarCheck className="size-5" />
        </span>
        <div>
          <DialogPrimitive.Title className="text-lg font-semibold text-brand-gold-light">
            {t("booking.dialog.title")}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-sm leading-relaxed text-white/80">
            {t("booking.dialog.intro")}
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

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.18em] text-brand-gold-muted">
          {t("booking.dialog.subject")}
        </span>
        <input
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={FIELD_CLASS}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.18em] text-brand-gold-muted">
          {t("booking.dialog.message")}
        </span>
        <textarea
          required
          rows={10}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(FIELD_CLASS, "resize-y leading-relaxed")}
        />
      </label>

      <p className="text-xs leading-relaxed text-white/70">{t("booking.dialog.hint")}</p>

      <button
        type="submit"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-gold/60 bg-brand-gold/15 px-5 py-3 text-sm font-semibold text-brand-gold-light transition-colors hover:border-brand-gold hover:bg-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-light/70"
      >
        <Send aria-hidden className="size-4" />
        {t("booking.dialog.submit")}
      </button>

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
    </form>
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
