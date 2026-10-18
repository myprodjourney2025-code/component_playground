import { expect, test } from "@playwright/test";

const html = "html";
const headerSwitch = (page: import("@playwright/test").Page) =>
  page.getByRole("banner").getByRole("switch", { name: "Dark mode" });

test.describe("system theme", () => {
  test.use({ colorScheme: "dark" });

  test("a dark system loads dark with no saved choice", async ({ page }) => {
    await page.goto("/components");
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
    await expect(headerSwitch(page)).toHaveAttribute("aria-checked", "true");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  test("the theme is set before first paint (no flash)", async ({ page }) => {
    // The inline script must have run by the time the document is parsed.
    await page.goto("/components", { waitUntil: "commit" });
    await page.waitForFunction(() => document.readyState !== "loading");
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
  });
});

test.describe("light system", () => {
  test.use({ colorScheme: "light" });

  test("loads light", async ({ page }) => {
    await page.goto("/components");
    await expect(page.locator(html)).not.toHaveClass(/\bdark\b/);
    await expect(headerSwitch(page)).toHaveAttribute("aria-checked", "false");
  });

  test("the switch changes the theme and the choice survives a reload", async ({
    page,
  }) => {
    await page.goto("/components");
    await headerSwitch(page).click();

    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
    await expect(headerSwitch(page)).toHaveAttribute("aria-checked", "true");

    await page.reload();
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
  });

  test("choosing what the system already has clears the saved choice", async ({
    page,
  }) => {
    await page.goto("/components");
    await headerSwitch(page).click(); // dark: remembered
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
    await headerSwitch(page).click(); // back to light = system
    await expect(page.locator(html)).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  test("works with reduced motion (instant, no animation)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/components");
    await headerSwitch(page).click();
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
  });

  test("a saved choice beats the system", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/components");
    await expect(page.locator(html)).toHaveClass(/\bdark\b/);
  });

  test("previews never change the site theme", async ({ page }) => {
    await page.goto("/components/theme-switch");
    await page.getByRole("tab", { name: "Flip the Sky" }).click();

    const preview = page.getByRole("tabpanel").getByRole("switch").first();
    await expect(preview).toHaveAttribute("aria-checked", "false");
    await preview.click();

    await expect(preview).toHaveAttribute("aria-checked", "true");
    await expect(page.locator(html)).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });
});
