// The app's i18n instance with every locale loaded, for tests. In the app a
// page only has its own locale's strings, read from its prerendered HTML
// (lib/i18n.ts); tests have no such HTML and switch languages freely.
import i18n, { addTranslations } from "../../lib/i18n";
import { translationsFor } from "../../lib/i18n/resources";
import { LOCALES } from "../../lib/locale";

for (const locale of LOCALES) addTranslations(locale, translationsFor(locale));

export default i18n;
