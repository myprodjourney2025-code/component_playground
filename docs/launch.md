# Launch and sharing checklist

Not legal advice. Check anything that matters to you with a qualified person.

## 1. Before going live
- [x] Dead code deleted; `/gallery` returns 404.
- [x] `npm run build` passes (the e2e job builds and serves it), and `/playground` redirects to `/components` in production.
- [ ] Look at light and dark mode, the theme reveal, and previews in Chrome, Safari and Firefox.
- [x] GitHub repo is public (linked from the header).

## 2. Deploy and domain (done)
The site is live on Vercel at **https://component.samiransetua.in** (`main` deploys to production).
Still to confirm in GitHub (the repo owner's settings, not code):
- [ ] Actions variable `SITE_URL=https://component.samiransetua.in` (see `docs/ci-cd.md`).
- [ ] Branch protection on `main`: require pull request, require the **Quality** and **E2E** checks, no bypass.

## 3. Search engines
- Add the domain in Google Search Console (a "Domain" property verifies with one DNS TXT record), then submit `https://component.samiransetua.in/sitemap.xml`.
- Do the same in Bing Webmaster Tools (can import from Search Console).
- Test structured data: https://search.google.com/test/rich-results and https://validator.schema.org/

## 4. AI answer engines (AEO / GEO)
- `/llms.txt` and `/llms-full.txt` are served; `robots.txt` allows all crawlers.
- Each page states what it is, its license and how to install in plain text, and has JSON-LD.
- Keep descriptions factual and specific; AI assistants quote concrete sentences.

## 5. Sharing
- Every page has its own social image (`/components/<slug>/opengraph-image`).
- Preview before posting: LinkedIn Post Inspector (https://www.linkedin.com/post-inspector/),
  and paste the URL into a draft post on X.
- Use the Share buttons on each component page.
- After a change, re-scrape in LinkedIn Post Inspector, as it caches old cards.

## 6. Legal and trust
- License: MIT (`LICENSE`, `/license`). Keep the copyright line.
- Privacy: no cookies, analytics or accounts. `localStorage` holds `theme`, and
  `morph-window:voice-shortcut` only if a visitor rebinds the voice key. The voice demo uses
  the browser's speech recognition, which in some browsers sends audio to the browser maker's
  service, and only after the visitor presses the mic. `/privacy` says all of this.
  Whenever a component stores something or contacts a service, update `/privacy` in the same PR.
  If you add analytics, update `/privacy` and (for EU/UK visitors) add consent first.
- Morph Window: the motion started from a floating help window in one of the owner's own
  projects. The owner confirmed on 2026-11-08 that they own that code, so publishing it under
  MIT is fine. Keep the project name out of public text.
- Inspiration: the Zigzag Trace was inspired by a screenshot of another product. The shape
  and code are your own, but do not publish the reference screenshots, and avoid copying
  logos, brand names or trademarks into components.
- Dependencies keep their own licenses (React, Motion, Tailwind: MIT; Geist font: OFL).
- Contact for takedowns and questions: set in `lib/site.ts` (`contactEmail`), shown on `/privacy` and in the footer.
- Domain, hosting and Search Console accounts: enable 2FA.

## 7. Release record
Every release is logged in `docs/releases.md`: what shipped, the checks run, known limits and
the manual checks still open. Add an entry before merging to `main`.
