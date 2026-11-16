import { devices, expect, test } from "@playwright/test";
import {
  HERO_BUTTON,
  HERO_FILL_VIDEO,
  HERO_VIDEO,
  captureAnalytics,
  heroState,
  lowPowerMode,
  simulateAppSwitch,
  waitForHeroPlaying,
} from "./helpers";

// The home page hero's background video (components/ui/hero.tsx). Each case
// here was a real or likely problem: it froze on iPhones, stayed frozen after
// an app switch, and showed no way to start it in iOS Low Power Mode.

test.describe("hero video - desktop", () => {
  test("plays, loops, pauses off screen and plays again in view", async ({ page }) => {
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    // The clip is 14 s: it must loop, not stop at the end.
    await page.waitForFunction((selector) => {
      const video = document.querySelector<HTMLVideoElement>(selector)!;
      return video.loop && !video.paused;
    }, HERO_VIDEO);

    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect.poll(() => heroState(page)).toBe("paused");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => heroState(page)).toBe("playing");
  });

  test("the visitor's pause sticks through scrolling and returning to the tab", async ({ page }) => {
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    await page.click(HERO_BUTTON);
    await expect(page.locator(HERO_BUTTON)).toHaveAttribute("aria-pressed", "true");

    await page.evaluate(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
      window.scrollTo(0, 3000);
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    expect(await heroState(page)).toBe("paused");

    await page.click(HERO_BUTTON);
    await expect.poll(() => heroState(page)).toBe("playing");
  });

  test("plays again after the browser paused it (app or tab switch)", async ({ page }) => {
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    await simulateAppSwitch(page);
    await expect.poll(() => heroState(page)).toBe("playing");
  });

  test("a video that keeps stalling gives way to the photo", async ({ page }) => {
    test.slow();
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    // A decoder that never moves on: time frozen, seeks ignored.
    await page.evaluate((selector) => {
      const video = document.querySelector<HTMLVideoElement>(selector)!;
      Object.defineProperty(video, "currentTime", { configurable: true, get: () => 1.5, set: () => {} });
    }, HERO_VIDEO);
    await expect.poll(() => heroState(page), { timeout: 25_000 }).toBe("paused");
    await expect(page.locator(HERO_VIDEO)).toHaveCSS("opacity", "0");
    await expect(page.locator(HERO_BUTTON)).toHaveCount(0);
  });

  test("no video for visitors who ask for less motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/video/upload/")) videoRequests.push(request.url());
    });
    await page.goto("/hu");
    await page.waitForTimeout(3000);
    expect(videoRequests).toEqual([]);
    await expect(page.locator(HERO_VIDEO)).toHaveCount(0);
    await context.close();
  });

  test("if the video can't be downloaded, the photo stays and there is no button", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/video/upload/**", (route) => route.abort());
    await page.goto("/hu");
    await page.waitForTimeout(3000);
    await expect(page.locator(HERO_VIDEO)).toHaveCount(0);
    await expect(page.locator(HERO_BUTTON)).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("reports the format and the outcome to the analytics", async ({ page }) => {
    await page.addInitScript(captureAnalytics);
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    const events = await page.evaluate(() => (window as unknown as { __events: unknown[] }).__events);
    expect(events).toContainEqual({ name: "Hero Video", data: { format: expect.stringMatching(/^(webm|hevc|mp4)$/), result: "playing" } });
  });
});

// The iPhone's screen, touch and user agent, in Chromium (WebKit isn't part
// of this setup).
const { defaultBrowserType: _webkit, ...iPhone } = devices["iPhone 15"];

test.describe("hero video - phone", () => {
  test.use(iPhone);

  test("portrait: the blurred copy plays with it and follows the pause button", async ({ page }) => {
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    await expect.poll(() => heroState(page, HERO_FILL_VIDEO)).toBe("playing");
    await page.click(HERO_BUTTON);
    await expect.poll(() => heroState(page, HERO_FILL_VIDEO)).toBe("paused");
  });

  test("turning the phone: the blurred copy goes in landscape and comes back upright", async ({ page }) => {
    await page.goto("/hu");
    await waitForHeroPlaying(page);
    await page.setViewportSize({ width: 852, height: 393 });
    await expect(page.locator(HERO_FILL_VIDEO)).toHaveCount(0);
    expect(await heroState(page)).toBe("playing");
    await page.setViewportSize({ width: 393, height: 852 });
    await expect.poll(() => heroState(page, HERO_FILL_VIDEO)).toBe("playing");
  });

  test("Low Power Mode: play button, and a tap anywhere starts the video", async ({ page }) => {
    await page.addInitScript(lowPowerMode);
    await page.goto("/hu");
    const button = page.locator(HERO_BUTTON);
    await expect(button).toBeVisible({ timeout: 45_000 });
    expect(await heroState(page)).toBe("paused");

    // Scrolling isn't a tap in iOS: still paused.
    await page.mouse.wheel(0, 300);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(500);
    expect(await heroState(page)).toBe("paused");

    await page.locator("h1").tap();
    await expect.poll(() => heroState(page)).toBe("playing");
  });

  test("Low Power Mode: one tap on the play button starts it", async ({ page }) => {
    await page.addInitScript(lowPowerMode);
    await page.goto("/hu");
    await expect(page.locator(HERO_BUTTON)).toBeVisible({ timeout: 45_000 });
    await page.locator(HERO_BUTTON).tap();
    await expect.poll(() => heroState(page)).toBe("playing");
  });
});
