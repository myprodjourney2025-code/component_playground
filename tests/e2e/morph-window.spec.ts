import AxeBuilder from "@axe-core/playwright";
import { devices, expect, test, type Page } from "@playwright/test";

const PAGE = "/components/morph-window";
const NAME = "Chat with Sparky";

/**
 * The button floats on purpose, so Playwright never sees it as "stable" and
 * its own click waits forever. Aim at the visible round mascot (the right end
 * of the button, which is as wide as the window) with a raw mouse or touch.
 */
async function mascotPoint(page: Page, name = NAME) {
  const button = page.getByRole("button", { name, exact: true });
  // A raw mouse click only works on what is on screen: bring the demo frame in.
  await button.evaluate((el) =>
    el.closest(".mw-root")?.parentElement?.scrollIntoView({ block: "center" }),
  );
  await page.waitForTimeout(250);
  const box = await button.boundingBox();
  if (!box) throw new Error("mascot button not found");
  return { x: box.x + box.width - 24, y: box.y + 24 };
}

const expanded = (page: Page, name = NAME) =>
  page.getByRole("button", { name, exact: true }).getAttribute("aria-expanded");

async function openByClick(page: Page, name = NAME) {
  await page.goto(PAGE);
  await page.waitForLoadState("networkidle");
  // Wait until the component has measured itself and is shown.
  await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
  const { x, y } = await mascotPoint(page, name);
  await page.mouse.click(x, y);
  await expect.poll(() => expanded(page, name)).toBe("true");
}

test.describe("Morph Window (desktop)", () => {
  test("opens, focuses the input, sends a message and gets a reply", async ({
    page,
  }) => {
    await openByClick(page);
    const input = page.getByLabel("Message");
    await expect(input).toBeFocused();

    await input.fill("hello from the test");
    await page.keyboard.press("Enter");

    await expect(page.getByText("hello from the test")).toBeVisible();
    await expect(input).toHaveValue("");
    await expect(page.getByText(/Happy to help/)).toBeVisible({
      timeout: 5000,
    });
  });

  test("one click outside closes it and keeps what was typed", async ({
    page,
  }) => {
    await openByClick(page);
    await page.getByLabel("Message").fill("an unsent draft");

    await page.mouse.click(5, 300);
    await expect.poll(() => expanded(page)).toBe("false");

    const { x, y } = await mascotPoint(page);
    await page.mouse.click(x, y);
    await expect.poll(() => expanded(page)).toBe("true");
    await expect(page.getByLabel("Message")).toHaveValue("an unsent draft");
  });

  test("Escape closes it and returns focus to the button", async ({ page }) => {
    await openByClick(page);
    await page.keyboard.press("Escape");
    await expect.poll(() => expanded(page)).toBe("false");
    await expect(
      page.getByRole("button", { name: NAME, exact: true }),
    ).toBeFocused();
  });

  test("a click anywhere in a hover-opened window keeps it open", async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.waitForLoadState("networkidle");
    const { x, y } = await mascotPoint(page);
    await page.mouse.move(x, y);
    await expect.poll(() => expanded(page)).toBe("true");
    await page.waitForTimeout(900); // let the opening animation finish

    const box = await page.locator(".mw-panel").first().boundingBox();
    if (!box) throw new Error("no window");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 - 20);
    await page.mouse.move(5, 300); // leave
    await page.waitForTimeout(600);
    expect(await expanded(page)).toBe("true");
  });

  test("the Help example does not open on hover, only on click", async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.getByRole("tab", { name: "Help panel" }).click();
    const { x, y } = await mascotPoint(page, "Help");

    await page.mouse.move(x, y);
    await page.waitForTimeout(500);
    expect(await expanded(page, "Help")).toBe("false");

    await page.mouse.click(x, y);
    await expect.poll(() => expanded(page, "Help")).toBe("true");
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`no serious accessibility problems with the window open (${scheme})`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      await openByClick(page);

      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      await context.close();
    });
  }
});

test.describe("Morph Window (phone)", () => {
  // Not the whole device descriptor: it carries defaultBrowserType, which
  // Playwright does not allow inside a describe group.
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } =
    devices["Pixel 7"];
  test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

  test("a tap opens it inside its frame, a tap outside closes it", async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.waitForLoadState("networkidle");

    const { x, y } = await mascotPoint(page);
    await page.touchscreen.tap(x, y);
    await expect.poll(() => expanded(page)).toBe("true");
    await page.waitForTimeout(900); // let the opening animation finish

    const fits = await page.evaluate(() => {
      const panel = document
        .querySelector(".mw-panel")!
        .getBoundingClientRect();
      const frame = document
        .querySelector(".mw-root")!
        .parentElement!.getBoundingClientRect();
      return (
        panel.left >= frame.left - 1 &&
        panel.right <= frame.right + 1 &&
        panel.top >= frame.top - 1 &&
        panel.bottom <= frame.bottom + 1
      );
    });
    expect(fits).toBe(true);

    await page.touchscreen.tap(8, 70);
    await expect.poll(() => expanded(page)).toBe("false");
  });

  test("the page does not scroll sideways and the input is 16px (no iOS zoom)", async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    const fontSize = await page.evaluate(() => {
      const input = document.querySelector("input[aria-label=Message]");
      return input ? parseFloat(getComputedStyle(input).fontSize) : 0;
    });
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test("a tap does not move focus into the input (it would raise the keyboard)", async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.waitForLoadState("networkidle");

    const { x, y } = await mascotPoint(page);
    await page.touchscreen.tap(x, y);
    await expect.poll(() => expanded(page)).toBe("true");
    await expect(page.getByLabel("Message")).not.toBeFocused();
  });
});
