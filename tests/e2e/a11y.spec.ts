import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { componentSlugs } from "./helpers";

const STATIC_PAGES = ["/components", "/license", "/privacy"];

// Fails the build on serious or critical accessibility problems, in both themes.
for (const scheme of ["light", "dark"] as const) {
  test.describe(`accessibility (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    test("every page has no serious violations", async ({ page, request }) => {
      const slugs = await componentSlugs(request);
      const paths = [...STATIC_PAGES, ...slugs.map((s) => `/components/${s}`)];

      for (const path of paths) {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        const { violations } = await new AxeBuilder({ page }).analyze();
        const blocking = violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        );

        expect(
          blocking.map((v) => `${path}: ${v.id}: ${v.help} (${v.nodes.length} nodes)`),
        ).toEqual([]);
      }
    });
  });
}
