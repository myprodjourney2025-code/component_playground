/** True for `next build` / `next start` (and any production deploy). */
export const isProduction = process.env.NODE_ENV === "production";
