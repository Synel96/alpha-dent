import { commonResources } from "../../lib/i18n/common";
import type { Locale } from "../../lib/locale";

export default function title(pageContext: { locale: Locale }) {
  return `${commonResources[pageContext.locale].nav.clinic} | Alpha Dent`;
}
