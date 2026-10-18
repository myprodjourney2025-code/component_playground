import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { galleryComponents } from "@/registry";

// Every example shown in the gallery must at least mount without throwing.
// New components are picked up automatically from the registry.
const cases = galleryComponents.flatMap((c) =>
  c.gallery!.examples.map((ex) => [`${c.slug} / ${ex.name}`, ex.load] as const),
);

describe.each(cases)("gallery example: %s", (_name, load) => {
  it("renders and unmounts cleanly", async () => {
    const { default: Example } = await load();
    const { container, unmount } = render(<Example />);
    expect(container.firstChild).not.toBeNull();
    expect(() => unmount()).not.toThrow();
  });
});

describe("gallery card previews", () => {
  const withPreview = galleryComponents.filter((c) => c.gallery?.cardPreview);

  it.each(withPreview.map((c) => [c.slug, c.gallery!.cardPreview!] as const))(
    "%s card preview renders",
    async (_slug, load) => {
      const { default: Preview } = await load();
      const { container } = render(<Preview />);
      expect(container.firstChild).not.toBeNull();
    },
  );
});

describe("playground demos", () => {
  it.each(galleryComponents.map((c) => [c.slug, c.load] as const))(
    "%s demo renders",
    async (_slug, load) => {
      const { default: Demo } = await load();
      const { container } = render(<Demo />);
      expect(container.firstChild).not.toBeNull();
    },
  );
});
