# Launch and sharing checklist

Not legal advice. Check anything that matters to you with a qualified person.

## 1. Before going live
- [ ] Delete dead code (see "Cleanup" below) and remove `redirects()` from `next.config.ts`.
- [ ] `npm run build` passes, `npm run start`: `/playground` returns 404.
- [ ] Look at light and dark mode, the theme reveal, and previews in Chrome, Safari and Firefox.
- [ ] Make the GitHub repo public (it is linked from the header).

## 2. Deploy to components.samiransetua.in
1. Deploy the repo (Vercel is the simplest for Next.js).
2. Add the domain `components.samiransetua.in` to the project.
3. At your DNS provider for `samiransetua.in`, add the record the host shows
   (usually `CNAME components -> cname.vercel-dns.com`).
4. Wait for HTTPS to be issued, then open the site over `https://`.

## 3. Search engines
- Add the domain in Google Search Console (a "Domain" property verifies with one DNS TXT record), then submit `https://components.samiransetua.in/sitemap.xml`.
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
- Privacy: no cookies, analytics or accounts, only `localStorage "theme"`. `/privacy` says so.
  If you add analytics, update `/privacy` and (for EU/UK visitors) add consent first.
- Inspiration: the Zigzag Trace was inspired by a screenshot of another product. The shape
  and code are your own, but do not publish the reference screenshots, and avoid copying
  logos, brand names or trademarks into components.
- Dependencies keep their own licenses (React, Motion, Tailwind: MIT; Geist font: OFL).
- Contact for takedowns and questions: set in `lib/site.ts` (`contactEmail`), shown on `/privacy` and in the footer.
- Domain, hosting and Search Console accounts: enable 2FA.

## Cleanup (needs a stopped dev server)
```powershell
Remove-Item -Recurse -Force app\gallery, components
Remove-Item -Force public\file.svg, public\globe.svg, public\next.svg, public\vercel.svg, public\window.svg
```
