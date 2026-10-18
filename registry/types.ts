import type { ComponentType } from "react";

/**
 * Add a new category here (and in CATEGORIES below) when you start
 * experimenting with something that doesn't fit an existing bucket.
 * The folder under `experiments/` should match the category id.
 */
export const CATEGORIES = {
  loaders: "Loaders",
  buttons: "Buttons",
  inputs: "Inputs & forms",
  switches: "Switches",
  cards: "Cards",
  navigation: "Navigation",
  feedback: "Feedback & overlays",
  effects: "Effects & backgrounds",
  sections: "Page sections",
  pages: "Full pages",
} as const;

export type Category = keyof typeof CATEGORIES;

/**
 * "card"  – demo is centred inside a fixed-size card (small components)
 * "full"  – demo fills the whole stage (page sections, full pages)
 */
export type StageLayout = "card" | "full";

/** One variant tab in the gallery: a live preview plus its source. */
export type GalleryExample = {
  /** Tab label */
  name: string;
  /** Path inside the experiment folder, e.g. "examples/teal.tsx" */
  file: string;
  /** Lazy import of the same file, for the live preview */
  load: () => Promise<{ default: ComponentType }>;
};

export type GalleryProp = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

/** A must-have for the component to work. List only what is required. */
export type GalleryRequirement = {
  name: string;
  note: string;
};

/**
 * Opt-in: experiments with this field appear in /components as a
 * copy-paste component (preview tabs, install, source, props).
 */
export type GalleryConfig = {
  /** File name a developer saves the component as, e.g. "zigzag-trace.tsx" */
  fileName: string;
  /** Import path shown in usage code, e.g. "@/components/zigzag-trace" */
  importPath: string;
  /** npm packages to install, e.g. ["motion"] */
  dependencies?: string[];
  /** Must-have dependencies only */
  requirements?: GalleryRequirement[];
  examples: GalleryExample[];
  props?: GalleryProp[];
};

export type Experiment = {
  /** URL slug, unique across ALL categories → /playground/<slug> */
  slug: string;
  title: string;
  category: Category;
  description?: string;
  tags?: string[];
  /** Link or note about where the idea came from */
  inspiration?: string;
  /** ISO date, e.g. "2026-10-17" – used for sorting "newest first" */
  createdAt: string;
  layout?: StageLayout;
  /** Set to publish this experiment in /components */
  gallery?: GalleryConfig;
  /** Lazy import of the demo so only the open experiment is bundled */
  load: () => Promise<{ default: ComponentType }>;
};
