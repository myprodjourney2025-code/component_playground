import { jsonLd } from "@/lib/json-ld";

/** Structured data for search engines and AI answer engines. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
