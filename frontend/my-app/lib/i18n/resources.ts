// Every locale's translations, merged per locale. Server-side only: the
// prerender gives each page just its own locale's strings (pages/+Head.tsx
// writes them into the HTML; lib/i18n.ts reads them back in the browser),
// so a visitor never downloads the other three languages. Importing this
// from code that also runs in the browser would bring all four back.
import { bookingResources } from "./booking";
import { clinicResources } from "./clinic";
import { commonResources } from "./common";
import { contactResources } from "./contact";
import { errorResources } from "./error";
import { faqResources } from "./faq";
import { galleryResources } from "./gallery";
import { metaResources } from "./meta";
import { servicesResources } from "./services";
import type { Locale } from "../locale";

const resources = {
  hu: {
    translation: {
      ...commonResources.hu,
      ...errorResources.hu,
      ...contactResources.hu,
      ...clinicResources.hu,
      ...faqResources.hu,
      ...galleryResources.hu,
      ...servicesResources.hu,
      ...metaResources.hu,
      ...bookingResources.hu,
    },
  },
  en: {
    translation: {
      ...commonResources.en,
      ...errorResources.en,
      ...contactResources.en,
      ...clinicResources.en,
      ...faqResources.en,
      ...galleryResources.en,
      ...servicesResources.en,
      ...metaResources.en,
      ...bookingResources.en,
    },
  },
  de: {
    translation: {
      ...commonResources.de,
      ...errorResources.de,
      ...contactResources.de,
      ...clinicResources.de,
      ...faqResources.de,
      ...galleryResources.de,
      ...servicesResources.de,
      ...metaResources.de,
      ...bookingResources.de,
    },
  },
  it: {
    translation: {
      ...commonResources.it,
      ...errorResources.it,
      ...contactResources.it,
      ...clinicResources.it,
      ...faqResources.it,
      ...galleryResources.it,
      ...servicesResources.it,
      ...metaResources.it,
      ...bookingResources.it,
    },
  },
} as const;

export type Translation = Record<string, unknown>;

export function translationsFor(locale: Locale): Translation {
  return resources[locale].translation;
}
