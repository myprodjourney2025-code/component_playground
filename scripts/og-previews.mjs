// Captures each published component's real gallery-card preview as a PNG for the
// share images. Needs the site running (default http://localhost:3000):
//   npm run dev   (other terminal)   then   npm run og:previews
// Commit the changed files in public/og/.
import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
/** Let looping animations reach a recognisable frame. */
const SETTLE_MS = Number(process.env.SETTLE_MS ?? 1400);

/** Capture density. public/og files are CSS size x SCALE; lib/og-previews.tsx divides it back. */
const SCALE = 4;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: SCALE,
  colorScheme: "light",
});
await page.goto(`${BASE_URL}/components`, { waitUntil: "networkidle" });

const cards = page.locator('ul a[href^="/components/"]');
const count = await cards.count();
for (let i = 0; i < count; i++) {
  const card = cards.nth(i);
  const slug = (await card.getAttribute("href")).split("/").pop();
  const preview = card.locator("[inert]").first();
  await preview.waitFor();
  await page.waitForTimeout(SETTLE_MS);
  // Just the component, not the card around it.
  await preview.locator(":scope > *").first().screenshot({ path: `public/og/${slug}.png` });
  console.log(`public/og/${slug}.png`);
}
await browser.close();
