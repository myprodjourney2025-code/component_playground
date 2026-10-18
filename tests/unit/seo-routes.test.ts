import { describe, expect, it } from "vitest";
import { GET as llms } from "@/app/llms.txt/route";
import { GET as llmsFull } from "@/app/llms-full.txt/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { readGallerySource } from "@/lib/gallery/read-source";
import { SITE, absoluteUrl } from "@/lib/site";
import { galleryComponents } from "@/registry";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the gallery and every component, once", () => {
    expect(urls).toContain(absoluteUrl("/components"));
    for (const c of galleryComponents) {
      expect(urls).toContain(absoluteUrl(`/components/${c.slug}`));
    }
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("never lists dev-only or removed routes", () => {
    for (const url of urls) {
      expect(url).not.toMatch(/\/(playground|gallery)/);
      expect(url.startsWith(SITE.url)).toBe(true);
    }
  });
});

describe("robots", () => {
  it("allows crawling and points at the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect(JSON.stringify(r.rules)).toContain('"allow":"/"');
  });
});

describe("llms.txt", () => {
  it("names the site and links every component", async () => {
    const text = await llms().text();
    expect(text).toContain(`# ${SITE.name}`);
    for (const c of galleryComponents) {
      expect(text).toContain(c.title);
      expect(text).toContain(absoluteUrl(`/components/${c.slug}`));
    }
  });
});

describe("llms-full.txt", () => {
  it("includes every component's source and props", async () => {
    const text = await (await llmsFull()).text();
    for (const c of galleryComponents) {
      const source = await readGallerySource({ ...c, gallery: c.gallery! });
      expect(text).toContain(`## ${c.title}`);
      // The first line of real code proves the file was embedded.
      expect(text).toContain(source.component.split("\n")[0]);
    }
    expect(text).toContain("### Props");
  });
});
