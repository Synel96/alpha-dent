import { metaResources } from "../lib/i18n/meta";
import type { Locale } from "../lib/locale";

// Default <title>, overridden per-page (see e.g. pages/kapcsolat/+title.ts).
export default function title(pageContext: { locale: Locale }) {
  return metaResources[pageContext.locale].meta.defaultTitle;
}
