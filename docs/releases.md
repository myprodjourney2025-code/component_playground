# Release record

One entry per release to production (`main`). Newest first. Add the entry in the same pull
request as the change, so the record and the code ship together.

## 2026-11-08: Morph Window

- **What:** a floating mascot button that grows into a chat, assistant or help window.
  Gallery slug `morph-window`, category Feedback & overlays. Examples: Chat assistant, Chat
  with voice (Alt+M, rebindable), Help panel.
- **Ownership:** the owner confirmed they own the code it was adapted from (their own
  project), so it is published under MIT. See `docs/launch.md` section 6.
- **Checks run before release:** `npm run check` (lint, types, 103 unit tests) and the full
  Playwright suite (33 tests, production build, includes an accessibility scan with the
  window open in light and dark). Phone behaviour checked with iPhone SE, iPhone 13,
  Pixel 7, iPad Mini and a landscape iPhone profile. The owner checked the Vercel preview.
- **Performance:** a 5 second trace of the idle button shows 0 paints and about 1ms of
  layout. The ring used to animate `box-shadow` and caused 376 paints in the same time.
- **Privacy:** `/privacy` was updated for the new `localStorage` key and the voice demo.
- **Known limits:**
  - Voice input could not be tested with a real microphone in automation. Test it by hand in
    Chrome and Edge. Firefox has no speech recognition, so the mic button is hidden there.
  - On iOS the on-screen keyboard can cover a window pinned to the bottom of the screen
    (a browser limit; not handled).
  - CI runs Chromium only. Safari and Firefox are manual checks.
  - The mascot is a temporary drawn robot. A custom mascot goes in through the `mascot` prop.
  - The brand name is undecided; the site still uses "Samiran Setua · Components".
- **Manual checks still open (owner):** Safari and Firefox, a real phone, real dictation,
  LinkedIn Post Inspector / X card refresh for `/components/morph-window`.

## 2026-10-18: Zigzag Trace and Theme Switch

- First public release of the gallery at https://component.samiransetua.in, with CI
  (Quality and E2E), post-deploy smoke test, SEO (sitemap, robots, JSON-LD, `llms.txt`),
  share images, 404 page, license and privacy pages.
