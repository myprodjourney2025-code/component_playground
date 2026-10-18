# Theme Switch

- **Inspiration:** (write in your own words)
- **Goal:** (write in your own words)

## Notes
- (what did you learn?)

## Usage

`component.tsx` is self-contained: it needs only React and Tailwind CSS v4 with
a class-based `dark` variant. Copy that one file into your project.

1. In your global CSS: `@custom-variant dark (&:where(.dark, .dark *));`
2. Put `<ThemeScript />` inside `<head>` of the root layout and add
   `suppressHydrationWarning` to `<html>` (sets the theme before first paint).
3. Render `<ThemeSwitch />` anywhere.

Two modes:

- **Site mode** (no `checked`): follows the system theme until the visitor
  chooses; a deliberate choice is saved in `localStorage` (`theme`). Changing
  theme plays a circular reveal from the switch (View Transitions API), skipped
  for `prefers-reduced-motion` and unsupported browsers.
- **Controlled mode** (`checked` + `onCheckedChange`): never touches the page,
  so it is safe inside previews.

All visuals are driven by one CSS variable, `--on` (0 = light, 1 = dark).
