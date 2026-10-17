# Component Playground

A personal lab for UI components, effects and page sections.
Next.js (App Router) · Tailwind v4 · Motion.

> Full explanation of every folder: [`docs/project-structure.md`](docs/project-structure.md)

## Structure

```
app/
  page.tsx                 gallery of all experiments
  playground/
    layout.tsx             sidebar + stage
    [slug]/page.tsx        renders one experiment on the canvas
    _components/           canvas, sidebar (playground-only UI)
experiments/
  <category>/<slug>/       one folder per experiment
    component.tsx          the reusable component (no playground code)
    demo.tsx               how it's shown on the canvas
    meta.ts                title, category, tags, layout, lazy loader
    README.md              inspiration + notes
  _template/               copy this to start a new one
registry/                  list of experiments + categories
components/                (create when needed) shared building blocks
hooks/                     (create when needed) shared hooks
lib/                       small utilities (cn, ...)
```

## Adding an experiment

1. `cp -r experiments/_template experiments/<category>/<slug>`
2. Edit `meta.ts` (unique `slug`, `category`, `layout`: `card` for small
   components, `full` for page sections / pages).
3. Register `meta` in `registry/index.ts`.
4. Open `/playground/<slug>`.

New category? Add it to `CATEGORIES` in `registry/types.ts`.

## Rules of thumb

- Experiments don't import from each other. Shared code moves up to
  `components/`, `hooks/` or `lib/`.
- Use `dark:` variants – the canvas toggles a `.dark` class on the stage.
- Anything using state, effects or `motion` needs `"use client"`.
