import { defineExperiment } from "@/registry/define";

// 1. Copy this folder to experiments/<category>/<slug>/
// 2. Fill in the fields below (slug must be unique)
// 3. Register `meta` in registry/index.ts
export const meta = defineExperiment({
  slug: "template",
  title: "Template",
  category: "loaders",
  description: "What is this and what are you exploring?",
  tags: [],
  createdAt: "2026-01-01",
  layout: "card",
  load: () => import("./demo"),
});
