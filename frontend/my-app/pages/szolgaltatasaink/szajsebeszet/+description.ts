import { servicesResources } from "../../../lib/i18n/services";
import type { Locale } from "../../../lib/locale";

export default function description(pageContext: { locale: Locale }) {
  return servicesResources[pageContext.locale].services.szajsebeszet.tagline;
}
