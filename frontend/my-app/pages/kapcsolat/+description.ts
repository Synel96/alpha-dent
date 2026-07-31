import { contactResources } from "../../lib/i18n/contact";
import type { Locale } from "../../lib/locale";

export default function description(pageContext: { locale: Locale }) {
  return contactResources[pageContext.locale].contactPage.intro;
}
