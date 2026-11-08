import { defineExperiment } from "@/registry/define";

export const meta = defineExperiment({
  slug: "morph-window",
  title: "Morph Window",
  category: "feedback",
  description:
    "A floating mascot button that grows into a chat, assistant or help window. Hover or tap to open, click outside to close.",
  tags: ["floating", "chat", "assistant", "popover", "clip-path", "tailwind"],
  inspiration: "A floating help window from one of my own projects",
  createdAt: "2026-10-19",
  layout: "full",
  gallery: {
    fileName: "morph-window.tsx",
    importPath: "@/components/morph-window",
    requirements: [
      { name: "React 19", note: "Uses the inert attribute and <style precedence>, both handled natively by React 19." },
      { name: "Tailwind CSS v4", note: "Styled with utility classes. Add @custom-variant dark (&:where(.dark, .dark *)); to your CSS so the dark: variant follows the dark class on <html>." },
    ],
    // The window, already open, as the card on the gallery page (not a variant tab).
    cardPreview: () => import("./card-preview"),
    examples: [
      { name: "Chat assistant", file: "examples/chat.tsx", load: () => import("./examples/chat") },
      { name: "Chat with voice", file: "examples/voice.tsx", load: () => import("./examples/voice") },
      { name: "Help panel", file: "examples/help.tsx", load: () => import("./examples/help") },
    ],
    props: [
      { name: "title", type: "string", description: "Required. The window's heading and the accessible name of the mascot button." },
      { name: "children", type: "ReactNode", description: "What the window shows. It scrolls when it is taller than the window." },
      { name: "footer", type: "ReactNode", description: "Pinned under the content, outside the scroll area. A message input, for example." },
      { name: "mascot", type: "ReactNode", description: "Replaces the built-in robot. It is fitted into a square of --mw-m (2.5rem)." },
      { name: "position", type: "string", default: "fixed, bottom-right", description: 'Tailwind classes for where it sits. To pin it inside a box, give the box `relative` and pass e.g. "absolute right-4 bottom-4".' },
      { name: "style", type: "CSSProperties", description: "Set --mw-from and --mw-to (button gradient), --mw-ring (the ring), --mw-m (mascot size) and --mw-width (open window width, default 22rem)." },
      { name: "bodyClassName", type: "string", default: '"space-y-4 p-5"', description: "Classes for the scrolling content area." },
      { name: "openOnHover", type: "boolean", default: "true", description: "Open when a mouse enters the button, close when it leaves unless it was clicked. Touch screens never hover." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Start open and pinned." },
      { name: "initialFocus", type: "string", description: 'A CSS selector inside the window to focus when it is opened by click, tap or keyboard, e.g. "input". Skipped on touch screens.' },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the window opens or closes. Use it to stop anything that should not run while it is hidden." },
    ],
  },
  load: () => import("./demo"),
});
