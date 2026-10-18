import { expect, test } from "@playwright/test";
import { componentSlugs } from "./helpers";

// Also run against the live site after every production deploy (see
// .github/workflows/post-deploy.yml), so nothing here may depend on the host.


test.describe("routes", () => {
  test("the root sends visitors to the gallery", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/components$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /copy-paste React components/i }),
    ).toBeVisible();
  });

  test("the gallery links to every component", async ({ page, request }) => {
    await page.goto("/components");
    for (const slug of await componentSlugs(request)) {
      await expect(page.locator(`a[href="/components/${slug}"]`)).toBeVisible();
    }
  });

  test("every component page shows variants, install steps, props and source", async ({
    page,
    request,
  }) => {
    for (const slug of await componentSlugs(request)) {
      await page.goto(`/components/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("tablist", { name: "Variants" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Props" })).toBeVisible();
      await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
      await expect(page.getByRole("region", { name: /source code/ }).first()).toBeVisible();
    }
  });

  test("switching variant tabs changes the shown code", async ({ page }) => {
    await page.goto("/components/zigzag-trace");
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    const code = page.getByRole("region", { name: /source code/ }).first();
    const before = await code.innerText();
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
    await expect.poll(() => code.innerText()).not.toBe(before);
  });

  test("legal pages exist and show the contact address", async ({ page }) => {
    await page.goto("/license");
    await expect(page.getByRole("heading", { level: 1, name: "License" })).toBeVisible();
    await expect(page.locator("pre")).toContainText("Permission is hereby granted");

    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  });

  test("unknown pages show the friendly 404 with a real 404 status", async ({
    page,
  }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("This page doesn't exist")).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse all components" })).toBeVisible();
  });

  test("the removed /gallery route is gone", async ({ page }) => {
    const response = await page.goto("/gallery");
    expect(response?.status()).toBe(404);
  });
});

test.describe("dev-only playground", () => {
  test("production visitors are sent to the gallery", async ({ page }) => {
    await page.goto("/playground/zigzag-trace");
    await expect(page).toHaveURL(/\/components$/);
  });
});

test.describe("header and footer", () => {
  test("link to GitHub with an icon-only button", async ({ page }) => {
    await page.goto("/components");
    const github = page.getByRole("link", { name: "View source on GitHub" });
    await expect(github).toHaveAttribute("href", /github\.com\//);
    await expect(github).toHaveAttribute("rel", /noopener/);
    await expect(github).toHaveText("");
  });

  test("footer offers license, privacy and contact", async ({ page }) => {
    await page.goto("/components");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "License" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });
});

test.describe("search and social metadata", () => {
  test("a component page has canonical, social card and structured data", async ({
    page,
  }) => {
    await page.goto("/components/theme-switch");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/components\/theme-switch$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/components\/theme-switch\/opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    const types = blocks
      .map((b) => JSON.parse(b))
      .flatMap((d) => d["@graph"] ?? [d])
      .map((n) => n["@type"]);
    expect(types).toContain("SoftwareSourceCode");
    expect(types).toContain("BreadcrumbList");
  });

  test("the social image is a real PNG", async ({ request }) => {
    const response = await request.get("/components/zigzag-trace/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("sitemap, robots and llms.txt are served", async ({ request }) => {
    const slugs = await componentSlugs(request);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const slug of slugs) expect(xml).toContain(`/components/${slug}`);
    expect(xml).not.toMatch(/playground|gallery/);

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

    const llms = await request.get("/llms.txt");
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain("Zigzag Trace");

    const full = await request.get("/llms-full.txt");
    expect(full.status()).toBe(200);
    expect(await full.text()).toContain("export function ThemeSwitch");
  });
});
