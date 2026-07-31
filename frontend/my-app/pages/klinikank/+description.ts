import { commonResources } from "../../lib/i18n/common";
import type { Locale } from "../../lib/locale";

export default function description(pageContext: { locale: Locale }) {
  return commonResources[pageContext.locale].common.comingSoon.description;
}
