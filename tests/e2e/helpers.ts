import type { APIRequestContext } from "@playwright/test";

/** Slugs of every published component, read from the live sitemap, so new components are covered without editing tests. */
export async function componentSlugs(request: APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  const slugs = [...xml.matchAll(/\/components\/([a-z0-9-]+)<\/loc>/g)].map(
    (m) => m[1],
  );
  if (slugs.length === 0) throw new Error("No components found in sitemap.xml");
  return slugs;
}
