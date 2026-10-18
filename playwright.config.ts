import { defineConfig, devices } from "@playwright/test";

// Point at a deployed site with BASE_URL=https://... (post-deploy smoke tests).
// Otherwise a production build is started locally: the same thing visitors get.
const remote = process.env.BASE_URL;
const port = 3100;
const baseURL = remote ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: remote
    ? undefined
    : {
        // CI builds in its own step first; locally this builds then serves.
        command: process.env.CI
          ? `npm run start -- -p ${port}`
          : `npm run build && npm run start -- -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});
