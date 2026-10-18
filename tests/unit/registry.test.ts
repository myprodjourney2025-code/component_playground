import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES, experiments, galleryComponents } from "@/registry";

const root = process.cwd();
const dirOf = (e: { category: string; slug: string }) =>
  path.join(root, "experiments", e.category, e.slug);
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

describe("registry", () => {
  it("has unique slugs", () => {
    const slugs = experiments.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses only known categories and ISO dates", () => {
    for (const e of experiments) {
      expect(Object.keys(CATEGORIES), e.slug).toContain(e.category);
      expect(e.createdAt, e.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("keeps at least one published component", () => {
    expect(galleryComponents.length).toBeGreaterThan(0);
  });
});

describe.each(galleryComponents.map((e) => [e.slug, e] as const))(
  "published component: %s",
  (_slug, e) => {
    const gallery = e.gallery!;
    const dir = dirOf(e);

    it("has the required metadata", () => {
      expect(e.title.length).toBeGreaterThan(2);
      expect(e.description?.length ?? 0).toBeGreaterThan(20);
      expect(gallery.fileName).toMatch(/\.tsx$/);
      expect(gallery.importPath).toMatch(/^@\/components\//);
      expect(gallery.examples.length).toBeGreaterThan(0);
      expect(gallery.props?.length ?? 0).toBeGreaterThan(0);
      expect(gallery.requirements?.length ?? 0).toBeGreaterThan(0);
    });

    it("has its own unit test file (tests/unit/<slug>.test.tsx)", () => {
      // Rule: no component is published without tests. See docs/testing.md.
      const file = path.join(root, "tests", "unit", `${e.slug}.test.tsx`);
      expect(existsSync(file), `missing ${path.relative(root, file)}`).toBe(true);
      const src = readFileSync(file, "utf8");
      expect(src, "test file has no tests").toContain("describe(");
      expect(
        ["it(", "it.each(", "test("].some((call) => src.includes(call)),
        "test file has no tests",
      ).toBe(true);
    });

    it("ships every file the gallery reads", () => {
      for (const file of ["component.tsx", "demo.tsx", "meta.ts", "README.md"]) {
        expect(existsSync(path.join(dir, file)), file).toBe(true);
      }
      for (const ex of gallery.examples) {
        expect(existsSync(path.join(dir, ex.file)), ex.file).toBe(true);
      }
    });

    it("lists each example and prop only once", () => {
      const names = gallery.examples.map((x) => x.name);
      expect(new Set(names).size).toBe(names.length);
      const props = (gallery.props ?? []).map((p) => p.name);
      expect(new Set(props).size).toBe(props.length);
    });

    it("keeps component.tsx copy-paste friendly (no repo-only imports)", () => {
      const source = readFileSync(path.join(dir, "component.tsx"), "utf8");
      // A developer pastes this one file; `@/...` or relative imports would break.
      expect(source).not.toMatch(/from\s+["']@\//);
      expect(source).not.toMatch(/from\s+["']\.{1,2}\//);
    });

    it("has examples that import the component the way users will", () => {
      for (const ex of gallery.examples) {
        const source = readFileSync(path.join(dir, ex.file), "utf8");
        expect(source, ex.file).toContain('"../component"');
      }
    });

    it("declares installable dependencies that the repo really uses", () => {
      for (const dep of gallery.dependencies ?? []) {
        expect(pkg.dependencies, dep).toHaveProperty(dep);
      }
    });
  },
);
