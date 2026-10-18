import { describe, expect, it } from "vitest";
import { jsonLd } from "@/lib/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";

describe("site config", () => {
  it("uses an https origin without a trailing slash", () => {
    expect(SITE.url).toMatch(/^https:\/\/[^/]+$/);
  });

  it("builds absolute URLs", () => {
    expect(absoluteUrl("/components")).toBe(`${SITE.url}/components`);
    expect(absoluteUrl()).toBe(`${SITE.url}/`);
  });

  it("has a contact email and repo link", () => {
    expect(SITE.contactEmail).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(SITE.repo).toMatch(/^https:\/\/github\.com\//);
  });
});

describe("jsonLd", () => {
  it("round-trips data", () => {
    const data = { "@type": "Thing", name: "A" };
    expect(JSON.parse(jsonLd(data))).toEqual(data);
  });

  it("can never close the script tag", () => {
    const out = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toContain("</script>");
  });
});
