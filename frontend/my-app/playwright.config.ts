import { defineConfig, devices } from "@playwright/test";

// Browser tests against the built site (`npm run build` first): the same
// prerendered pages and bundles that go live, served by `vike preview`.
// The hero video comes from Cloudinary, so these need internet access.
const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  // Muted autoplay is allowed anyway; the flag only keeps Chrome's autoplay
  // heuristics out of the picture, so a test can't fail because of them.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] } },
    },
  ],
  webServer: {
    command: `npx vike preview --port ${PORT}`,
    url: `http://localhost:${PORT}/hu`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
