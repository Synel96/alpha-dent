import { pageMeta } from "../lib/i18n/meta";
import type { Locale } from "../lib/locale";

// Also the fallback for pages without their own +description.ts (the home page
// and the error page).
export default function description(pageContext: { locale: Locale }) {
  return pageMeta(pageContext.locale, "home").description;
}
