# Components

Free, copy-paste React components with motion, by [Samiran Setua](https://samiransetua.in).
Live at **https://components.samiransetua.in**. Open a component, preview its
variants, copy the code into your project. MIT licensed.

Built with Next.js (App Router, Cache Components) · Tailwind CSS v4 · Motion.

> Full explanation of every folder: [`docs/project-structure.md`](docs/project-structure.md)
> Launch and sharing checklist: [`docs/launch.md`](docs/launch.md)
> Tests and the publishing rule: [`docs/testing.md`](docs/testing.md) · CI/CD: [`docs/ci-cd.md`](docs/ci-cd.md)

## Routes

| Route | What it is |
| --- | --- |
| `/` | Redirects to `/components` |
| `/components` | Gallery: a live preview card per component |
| `/components/<slug>` | Variants, install steps, source to copy, props |
| `/license`, `/privacy` | Legal pages |
| `/playground`, `/playground/<slug>` | Dev-only canvas (404 in production) |
| `/sitemap.xml`, `/robots.txt` | Search engines |
| `/llms.txt`, `/llms-full.txt` | AI assistants (site map; full source) |

## Structure

```
app/
  components/              the public gallery
    [slug]/                component page (+ opengraph-image.tsx)
    _components/           code block, variant viewer, share links
  (legal)/                 /license and /privacy
  playground/              dev-only canvas
  _components/             site header, footer, JSON-LD
  sitemap.ts robots.ts     SEO
  llms.txt/ llms-full.txt/ AI-readable site map and source
experiments/
  <category>/<slug>/       one folder per component
    component.tsx          the reusable component (what users copy)
    demo.tsx               how it appears on the playground canvas
    examples/              variants shown in the gallery
    meta.ts                title, category, gallery config, props
    README.md              inspiration + notes
  _template/               copy this to start a new one
registry/                  experiment list + categories
lib/                       site config (site.ts), OG images, source reader
```

## Adding a component

1. `cp -r experiments/_template experiments/<category>/<slug>`
2. Fill in `meta.ts` (unique `slug`, `category`, `gallery` config with
   `examples`, `props`, must-have `requirements`).
3. Register `meta` in `registry/index.ts`.
4. Preview at `/playground/<slug>` (dev) and `/components/<slug>`.
5. **Write `tests/unit/<slug>.test.tsx`.** No component is published without
   tests; the suite fails if the file is missing. See [`docs/testing.md`](docs/testing.md).
6. `npm run check`, then `npm run test:e2e`.

The sitemap, social image, `llms.txt` and structured data update automatically
from the registry. New category? Add it to `CATEGORIES` in `registry/types.ts`.

## Rules of thumb

- Experiments don't import from each other; shared code goes in `lib/`.
- `component.tsx` must stay copy-paste friendly: only React, Motion and Tailwind.
- Anything using state, effects or `motion` needs `"use client"`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run check   # lint + types + unit tests
npm run test:e2e  # build + Playwright + accessibility (stop `next dev` first)
```

## License

[MIT](LICENSE) © 2026 Samiran Setua
