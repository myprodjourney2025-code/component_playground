# Testing

Two layers. Both run in CI before anything is deployed (`docs/ci-cd.md`).

| Layer | Tool | Where | What it proves |
| --- | --- | --- | --- |
| Unit / component | Vitest + Testing Library (jsdom) | `tests/unit/` | A component's behaviour and the site's data are correct |
| End to end | Playwright (Chromium) + axe | `tests/e2e/` | The built site works for a visitor, and is accessible |

## Commands

```bash
npm run check        # lint + types + unit tests (run this before every commit)
npm test             # unit tests once
npm run test:watch   # unit tests while you work
npm run test:e2e     # builds, serves on :3100, runs Playwright
```

Stop `next dev` before `npm run test:e2e`: it runs `next build`, which uses the same `.next` folder.
First time on a machine: `npx playwright install chromium`.

## The rule: no component is published without tests

A component is published when its `meta.ts` has a `gallery` config. Before adding
one, all of this must be true:

1. **`tests/unit/<slug>.test.tsx` exists** (named exactly like the slug). The
   registry test fails if it is missing or empty.
2. **It covers the contract** (see the checklist below).
3. **Automatic checks pass.** These need no extra work, but can fail:
   - every example mounts and unmounts (`gallery-examples.test.tsx`)
   - `component.tsx` has no `@/` or relative imports, so it is copy-paste safe
   - examples import `"../component"`, so the gallery can rewrite the path
   - listed dependencies really exist in `package.json`
   - required files exist (`component.tsx`, `demo.tsx`, `meta.ts`, `README.md`)
   - the page is in the sitemap, passes the accessibility scan in light and dark, and has social metadata (e2e discovers new components from `/sitemap.xml`)
4. **`npm run check` and `npm run test:e2e` are green.**
5. Anything new that is not covered automatically (a new interaction, a new route) gets an e2e test.

### What a component test should cover

Write what a user or a copying developer relies on, not implementation details.

- Renders with defaults, and with each prop that changes the output.
- Accessible role and name (`getByRole(...)`). Loaders: `role="status"` plus a label.
- Interaction: click, keyboard, controlled vs uncontrolled behaviour, callbacks.
- `prefers-reduced-motion` (use `mockMedia({ reducedMotion: true })`).
- Light/dark or other theme logic, if there is any.
- Cleanup: timers and listeners do not leak (unmount does not throw).

### Starting a new test file

Copy the closest existing one: `tests/unit/zigzag-trace.test.tsx` (display
component) or `tests/unit/theme-switch.test.tsx` (interactive, stateful).

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyThing } from "@/experiments/<category>/<slug>/component";
import { mockMedia } from "./media";

describe("MyThing", () => {
  it("renders an accessible element", () => {
    render(<MyThing />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  });

  it("works with reduced motion", () => {
    mockMedia({ reducedMotion: true });
    render(<MyThing />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
```

`tests/unit/setup.ts` already resets `matchMedia`, `localStorage` and the `dark`
class before each test.

## Notes

- jsdom cannot render async Server Components, so pages are covered by e2e tests, not unit tests.
- jsdom has no layout, so visual details (spacing, shadows, colours) are checked by eye. Look at every new component in light and dark before publishing.
- The accessibility scan fails the build on `serious` and `critical` issues. Do not silence one without writing the reason in the test.
