# Project structure – full reference

Two kinds of things live in this repo:

- **The playground app** – the shell (sidebar, canvas, gallery). Rarely touched.
- **The experiments** – your actual work: components, effects, page sections.
  You will spend nearly all your time here.

They are kept separate so experiments can be copied straight into other
projects.

## Root files

| File | What it is |
|---|---|
| `AGENTS.md` | Rules for any AI agent: mentor mode, latest-docs rule, Next.js / Motion / React conventions. |
| `CLAUDE.md` | One line, `@AGENTS.md`, so Claude Code reads the same rules. |
| `README.md` | Short human guide: layout and how to add an experiment. |
| `package.json` | Dependencies: Next 16.4.2, React 19.3, Motion 14.3, Tailwind 4. |
| `next.config.ts` | `cacheComponents` and `partialPrefetching` on, plus the Tailwind/Turbopack rule. |
| `tsconfig.json` | Strict TypeScript. `@/*` maps to the repo root (`@/registry`, `@/experiments/...`). |
| `eslint.config.mjs` | Lint rules. |

## `app/` – the playground shell

Next.js routing: a folder becomes a URL only if it contains `page.tsx`.

```
app/
  layout.tsx              root HTML: fonts (Geist), title template
  globals.css             Tailwind + theme tokens + dark: variant
  page.tsx                "/"  gallery of all experiments by category
  playground/
    layout.tsx            "/playground/*"  sidebar left, stage right
    page.tsx              "/playground"    "pick an experiment" message
    [slug]/page.tsx       "/playground/<slug>"  renders one experiment
    _components/
      sidebar.tsx         nav grouped by category, highlights the active one
      canvas.tsx          the stage: toolbar, card/full layout, theme, replay
```

- **`globals.css`** – the `dark:` variant follows a `.dark` class instead of the
  system setting, so the canvas can flip dark mode for one stage without
  changing your OS. Tokens (`--muted`, `--border`, `--surface`) are for the
  shell; inside the white card your demo is free to look however you want.
- **`[slug]/page.tsx`** – square brackets = dynamic route. It reads the slug,
  looks the experiment up in the registry, lazy-loads its demo and wraps it in
  `Canvas`. Because Cache Components is on, `generateStaticParams` pre-builds
  one page per experiment and **must return at least one item** (that is why
  `_template` stays registered).
- **`_components/`** – the underscore makes it private (never a route). Holds
  playground-only UI.
- **Server vs client** – `layout.tsx`, `page.tsx` and `[slug]/page.tsx` are
  Server Components. `sidebar.tsx` (`usePathname`) and `canvas.tsx` (state) are
  Client Components (`"use client"`).

## `experiments/` – your actual work

```
experiments/
  _template/                  never edit; copy it
  loaders/
    spinner-ring/             one folder per idea
      component.tsx           the reusable thing
      demo.tsx                how it is shown on the canvas
      meta.ts                 identity card for the registry
      README.md               inspiration + what you learned
  buttons/ ...
  sections/ ...
```

- **Category folder** (`loaders/`, `buttons/`, `sections/`) matches a category
  id in `registry/types.ts`. Keeps things findable at 100+ experiments.
- **`component.tsx`** – the pure component. No playground code, so the file can
  be pasted into a real project.
- **`demo.tsx`** – the gallery presentation: variants, sizes, states, and any
  buttons/props wiring needed for testing.
- **`meta.ts`** – slug, title, category, tags, `layout` (`card` | `full`), date
  and `load: () => import("./demo")`. That `load` function means only the open
  experiment's code is downloaded.
- **`README.md`** – inspiration, goal, notes. Write it in your own words; it is
  your learning journal.

## `registry/` – the index

```
registry/
  types.ts     CATEGORIES list + the Experiment type
  define.ts    defineExperiment(): only gives type-checking in meta.ts
  index.ts     list of registered experiments + lookup helpers
```

The sidebar, gallery and routes all read from here. Adding something = one
import + one line in `index.ts`. `define.ts` is separate from `index.ts` to
avoid a circular import (`index.ts` imports each `meta.ts`, and each `meta.ts`
needs `defineExperiment`).

## `lib/` and future folders

- `lib/cn.ts` – tiny className joiner for conditional classes.
- Create `components/` (shared building blocks) and `hooks/` (shared hooks)
  **only when a second experiment needs the same thing**, not in advance.

## Workflows

**Add an experiment**

1. Copy `experiments/_template` to `experiments/<category>/<slug>/`.
2. Edit `meta.ts` (unique `slug`, `category`, `layout`).
3. Register `meta` in `registry/index.ts`.
4. Open `/playground/<slug>`.

**What happens when you open one**

URL slug → `[slug]/page.tsx` → finds it in the registry → awaits `load()` to get
your Demo → renders it inside `<Canvas>` (stage + toolbar).

**New category** – add it to `CATEGORIES` in `registry/types.ts`, then create
`experiments/<category>/`.

## Gotchas

- Keep at least one experiment registered or the build fails (Cache Components
  requires ≥ 1 static param).
- Experiments never import from each other; shared code moves up to
  `components/`, `hooks/` or `lib/`.
- Anything using state, effects or `motion` needs `"use client"`.

---

## Update: public site (October 2026)

The repo is now a public component gallery. What changed since the sections above:

- `app/gallery` became `app/components`; `/` redirects there.
- `app/playground` is dev-only (`notFound()` in production).
- `registry` entries with a `gallery` config are published: examples, props,
  requirements and the component source are read at build time.
- Site identity (name, URL, repo, author) lives in `lib/site.ts`. Change the
  domain there and every canonical URL, sitemap entry and OG tag follows.
- SEO/AEO/GEO: `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt`,
  `app/llms-full.txt`, JSON-LD (`app/_components/json-ld.tsx`) and generated
  social images (`opengraph-image.tsx`, `lib/og.tsx`).
- Theme: `experiments/switches/theme-switch/component.tsx` exports both
  `ThemeScript` (no-flash, follows the system) and `ThemeSwitch`.
