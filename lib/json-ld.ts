/** Serialises JSON-LD for a <script> tag. `<` is escaped so content can never close the tag. */
export const jsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
