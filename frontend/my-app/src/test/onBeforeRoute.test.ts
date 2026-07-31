import { describe, it, expect } from "vitest";
import { onBeforeRoute } from "../../pages/+onBeforeRoute";

function makePageContext(pathname: string, href = `https://example.test${pathname}`) {
  return { urlParsed: { pathname, href } };
}

describe("onBeforeRoute", () => {
  it("prefix nélküli útvonalon a hu locale-t állítja be, és nem módosítja az útvonalat", () => {
    const result = onBeforeRoute(makePageContext("/kapcsolat"));
    expect(result.pageContext.locale).toBe("hu");
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat");
  });

  it("/en prefix esetén az en locale-t állítja be, és levágja a prefixet", () => {
    const result = onBeforeRoute(makePageContext("/en/kapcsolat"));
    expect(result.pageContext.locale).toBe("en");
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat");
  });

  it("a lekérdezési paramétereket megőrzi a prefix levágásakor", () => {
    const result = onBeforeRoute(
      makePageContext("/en/kapcsolat", "https://example.test/en/kapcsolat?utm_source=x")
    );
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat?utm_source=x");
  });

  it("/en gyökér útvonalat a főoldalra ('/') vágja le", () => {
    const result = onBeforeRoute(makePageContext("/en", "https://example.test/en"));
    expect(result.pageContext.locale).toBe("en");
    expect(result.pageContext.urlLogical).toBe("https://example.test/");
  });
});
