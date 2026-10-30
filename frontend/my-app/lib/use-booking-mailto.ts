import { useTranslation } from "react-i18next";
import { bookingMailto } from "./booking";
import type { ServiceSlug } from "./service-cards";

// The appointment request e-mail in the page's language; on a service page
// the treatment line is filled in with that service.
export function useBookingMailto(service?: ServiceSlug): string {
  const { t } = useTranslation();
  return bookingMailto(
    t("booking.subject"),
    t("booking.body", { service: service ? t(`services.${service}.nav`) : "" })
  );
}
