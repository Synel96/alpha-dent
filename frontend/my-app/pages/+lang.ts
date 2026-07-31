// Sets `<html lang>` from the URL locale prefix, see pages/+onBeforeRoute.ts
export default function lang(pageContext: { locale: string }) {
  return pageContext.locale;
}
