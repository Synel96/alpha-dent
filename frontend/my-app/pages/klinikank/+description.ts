import { clinicResources } from "../../lib/i18n/clinic";
import type { Locale } from "../../lib/locale";

export default function description(pageContext: { locale: Locale }) {
  return clinicResources[pageContext.locale].clinicPage.metaDescription;
}
