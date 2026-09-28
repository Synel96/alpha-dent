import { describe, it, expect } from "vitest";
import { onBeforeRoute } from "../../pages/+onBeforeRoute";

function makePageContext(pathname: string, href = `https://example.test${pathname}`) {
  return { urlParsed: { pathname, href } };
}

describe("onBeforeRoute", () => {
  it("/hu prefix esetén a hu locale-t állítja be, és a magyar útvonalra route-ol", () => {
    const result = onBeforeRoute(makePageContext("/hu/kapcsolat"));
    expect(result.pageContext.locale).toBe("hu");
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat");
  });

  it("lefordított URL-t a magyar fájlrendszer-útvonalra fordít vissza", () => {
    const result = onBeforeRoute(makePageContext("/de/kontakt"));
    expect(result.pageContext.locale).toBe("de");
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat");
  });

  it("a lekérdezési paramétereket megőrzi", () => {
    const result = onBeforeRoute(
      makePageContext("/en/contact", "https://example.test/en/contact?utm_source=x")
    );
    expect(result.pageContext.urlLogical).toBe("https://example.test/kapcsolat?utm_source=x");
  });

  it("a nyelvi gyökér útvonalat a főoldalra ('/') route-olja", () => {
    const result = onBeforeRoute(makePageContext("/en", "https://example.test/en"));
    expect(result.pageContext.locale).toBe("en");
    expect(result.pageContext.urlLogical).toBe("https://example.test/");
  });
});
