import { pageMeta } from "../../lib/i18n/meta";
import type { Locale } from "../../lib/locale";

export default function description(pageContext: { locale: Locale }) {
  return pageMeta(pageContext.locale, "services").description;
}
