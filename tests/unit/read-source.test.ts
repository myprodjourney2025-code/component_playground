import { describe, expect, it } from "vitest";
import { readGallerySource } from "@/lib/gallery/read-source";
import { galleryComponents } from "@/registry";

describe.each(galleryComponents.map((e) => [e.slug, e] as const))(
  "readGallerySource: %s",
  (_slug, experiment) => {
    it("returns the component and rewrites example imports", async () => {
      const gallery = experiment.gallery!;
      const source = await readGallerySource({ ...experiment, gallery });

      expect(source.component).toContain("export function");
      for (const ex of gallery.examples) {
        const code = source.examples[ex.file];
        expect(code, ex.file).toContain(`"${gallery.importPath}"`);
        expect(code, ex.file).not.toContain('"../component"');
      }
    });
  },
);
