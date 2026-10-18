import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Experiment, GalleryConfig } from "@/registry/types";

export type GallerySource = {
  /** The whole component file, ready to copy in one go. */
  component: string;
  /** Source of each example, keyed by its file path. */
  examples: Record<string, string>;
};

/** Server-only: reads the files the gallery shows for copy-paste. */
export async function readGallerySource(
  experiment: Experiment & { gallery: GalleryConfig },
): Promise<GallerySource> {
  const dir = path.join(
    process.cwd(),
    "experiments",
    experiment.category,
    experiment.slug,
  );
  const { examples, importPath } = experiment.gallery;

  const [component, ...sources] = await Promise.all([
    readFile(path.join(dir, "component.tsx"), "utf8"),
    ...examples.map((e) => readFile(path.join(dir, e.file), "utf8")),
  ]);

  return {
    component,
    examples: Object.fromEntries(
      examples.map((e, i) => [
        e.file,
        // Examples import "../component" inside this repo; a developer
        // copying them will have saved the component at `importPath`.
        sources[i].replaceAll('"../component"', `"${importPath}"`),
      ]),
    ),
  };
}
