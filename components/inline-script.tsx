/**
 * Inline script that runs while the browser parses the server HTML (before
 * first paint). On the client React would only warn about a <script>, so it is
 * rendered inert there; suppressHydrationWarning covers the `type` difference.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
