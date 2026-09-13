import { servicesResources } from "../../lib/i18n/services";
import type { Locale } from "../../lib/locale";

export default function title(pageContext: { locale: Locale }) {
  return `${servicesResources[pageContext.locale].servicesHub.title} | Alphadent`;
}
