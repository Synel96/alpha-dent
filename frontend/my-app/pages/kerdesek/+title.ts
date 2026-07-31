import { faqResources } from "../../lib/i18n/faq";
import type { Locale } from "../../lib/locale";

export default function title(pageContext: { locale: Locale }) {
  return `${faqResources[pageContext.locale].faqPage.title} | Alpha Dent`;
}
