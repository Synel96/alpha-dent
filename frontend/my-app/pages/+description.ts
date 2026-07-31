import { metaResources } from "../lib/i18n/meta";
import type { Locale } from "../lib/locale";

// Default meta description, overridden per-page (see e.g. pages/kapcsolat/+description.ts).
export default function description(pageContext: { locale: Locale }) {
  return metaResources[pageContext.locale].meta.defaultDescription;
}
