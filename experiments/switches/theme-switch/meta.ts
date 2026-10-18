import { defineExperiment } from "@/registry/define";

export const meta = defineExperiment({
  slug: "theme-switch",
  title: "Theme Switch",
  category: "switches",
  description:
    "An animated light and dark switch with a carved track, sun and crescent moon. Follows the system until you override it.",
  tags: ["switch", "theme", "dark-mode", "tailwind"],
  createdAt: "2026-10-18",
  layout: "card",
  gallery: {
    fileName: "theme-switch.tsx",
    importPath: "@/components/theme-switch",
    requirements: [
      { name: "React 18 or 19", note: "Uses hooks such as useSyncExternalStore." },
      { name: "Tailwind CSS v4", note: "Styled with utility classes. Add @custom-variant dark (&:where(.dark, .dark *)); to your CSS so the dark: variant follows the dark class on <html>." },
      { name: "<ThemeScript />", note: "Render it inside <head> of your root layout so the theme is set before the first paint. Add suppressHydrationWarning to <html>." },
    ],
    examples: [
      { name: "Auto-play", file: "examples/autoplay.tsx", load: () => import("./examples/autoplay") },
      { name: "Interactive", file: "examples/default.tsx", load: () => import("./examples/default") },
      { name: "In a header", file: "examples/header.tsx", load: () => import("./examples/header") },
    ],
    props: [
      { name: "checked", type: "boolean", description: "Controlled state. Omit it and the switch drives the site theme (the dark class on <html>)." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the next value when the switch is clicked in controlled mode." },
      { name: "className", type: "string", default: '""', description: "Extra classes for the switch button." },
      { name: "label", type: "string", default: '"Dark mode"', description: "Accessible name announced to screen readers." },
    ],
  },
  load: () => import("./demo"),
});
