import type { Page } from "@playwright/test";

// The hero's sharp video (the blurred copy behind it on portrait phones has
// the blur-2xl class).
export const HERO_VIDEO = "video:not(.blur-2xl)";
export const HERO_FILL_VIDEO = "video.blur-2xl";
export const HERO_BUTTON = "button[aria-pressed]";

export async function waitForHeroPlaying(page: Page, minTime = 1) {
  await page.waitForFunction(
    ({ selector, minTime }) => {
      const video = document.querySelector<HTMLVideoElement>(selector);
      return !!video && !video.paused && video.currentTime > minTime;
    },
    { selector: HERO_VIDEO, minTime },
    { timeout: 45_000 }
  );
}

export function heroState(page: Page, selector = HERO_VIDEO) {
  return page.evaluate((selector) => {
    const video = document.querySelector<HTMLVideoElement>(selector);
    if (!video) return "none" as const;
    return video.paused ? ("paused" as const) : ("playing" as const);
  }, selector);
}

// What iOS Low Power Mode does: play() only succeeds during a real tap.
// (Trusted taps are tracked here, as Playwright's own navigation can leave
// the browser's user-activation flag set.)
export function lowPowerMode() {
  const play = HTMLMediaElement.prototype.play;
  let tapAt = -Infinity;
  for (const type of ["touchend", "click", "pointerup"]) {
    addEventListener(type, (event) => {
      if (event.isTrusted) tapAt = performance.now();
    }, true);
  }
  HTMLMediaElement.prototype.play = function () {
    return performance.now() - tapAt < 1000
      ? play.call(this)
      : Promise.reject(new DOMException("Low Power Mode", "NotAllowedError"));
  };
}

// The phone pausing the video while the visitor is in another app, then
// the page being shown again.
export async function simulateAppSwitch(page: Page) {
  await page.evaluate((selector) => {
    document.querySelector<HTMLVideoElement>(selector)?.pause();
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
  }, HERO_VIDEO);
}

// Collects Vercel Web Analytics events (window.va) instead of sending them.
export function captureAnalytics() {
  const events: unknown[] = [];
  Object.defineProperty(window, "__events", { value: events });
  Object.defineProperty(window, "va", {
    configurable: true,
    get: () => (...args: unknown[]) => {
      if (args[0] === "event") events.push(args[1]);
    },
    set: () => {},
  });
}
