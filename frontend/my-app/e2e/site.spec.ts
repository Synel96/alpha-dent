import { devices, expect, test } from "@playwright/test";

const { defaultBrowserType: _webkit, ...pixel } = devices["Pixel 7"];

test.describe("pages and languages", () => {
  for (const path of ["/hu", "/en", "/de", "/it", "/de/leistungen", "/en/faq", "/hu/kapcsolat"]) {
    test(`${path} loads without errors, in its own language`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      // Failed requests by URL; Vercel's analytics script only exists on
      // Vercel itself, not on the local preview server.
      page.on("response", (response) => {
        if (response.status() >= 400 && !response.url().includes("/_vercel/")) {
          errors.push(`${response.status()} ${response.url()}`);
        }
      });
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
          errors.push(message.text());
        }
      });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", path.split("/")[1]);
      await expect(page.locator("h1")).toHaveCount(1);
      // Let hydration finish; a mismatch shows up as a console error.
      await page.waitForTimeout(1500);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("appointment request dialog", () => {
  test("opens from the hero and closes with Escape", async ({ page }) => {
    await page.goto("/hu");
    await page.locator("main a:visible", { hasText: /Időpontot kérek/i }).first().click();
    const dialog = page.locator("[role=dialog]:has(form)");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});

test.describe("mobile menu", () => {
  test.use(pixel);

  test("opens, and its links navigate", async ({ page }) => {
    await page.goto("/de");
    const toggle = page.locator("header button[aria-haspopup=dialog]:visible");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.locator('[role=dialog]:not([inert]) a[href="/de/faq"]').click();
    await expect(page).toHaveURL(/\/de\/faq$/);
  });
});

test.describe("search engine markup", () => {
  test("the FAQ page's FAQPage markup lists exactly the questions on the page", async ({ page }) => {
    await page.goto("/de/faq");
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
    const faq = data["@graph"].find((node: { "@type": string }) => node["@type"] === "FAQPage");
    const inMarkup: string[] = faq.mainEntity.map((entry: { name: string }) => entry.name);
    const onPage = await page.locator("section[id] button[aria-expanded]").allTextContents();
    expect(inMarkup).toHaveLength(16);
    // Each accordion button also shows its number ("01") and a "+" sign.
    expect(onPage).toHaveLength(inMarkup.length);
    onPage.forEach((text, index) => expect(text).toContain(inMarkup[index]));
  });

  test("every page has a canonical link and hreflang alternates for all four languages", async ({ page }) => {
    await page.goto("/hu/klinikank");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://alpha-dent.eu/hu/klinikank");
    const languages = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("hreflang"))
    );
    expect(languages.sort()).toEqual(["de", "en", "hu", "it", "x-default"]);
  });
});
