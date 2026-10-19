import type { ReactElement } from "react";

/**
 * Static stand-ins for each component's gallery card, drawn for the share image.
 * Satori cannot run the real components (no CSS variables, no motion), so a
 * component without an entry here gets the plain title card instead.
 */
const PREVIEWS: Record<string, () => ReactElement> = {
  "zigzag-trace": () => (
    <svg width="190" height="190" viewBox="0 0 57 100">
      <path
        d="M14.9 92.1 L31.3 75.7 H7.7 L34.7 48.7 H8.7 L49.7 7.7"
        fill="none"
        stroke="#dbe7ff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9 92.1 L31.3 75.7 H7.7 L34.7 48.7"
        fill="none"
        stroke="#7430dc"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "theme-switch": () => (
    <div
      style={{
        display: "flex",
        width: 220,
        height: 110,
        borderRadius: 55,
        background: "linear-gradient(180deg, #1b2a5c 0%, #3b3f8f 100%)",
        boxShadow: "inset 0 4px 8px rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 11,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 88,
          height: 88,
          borderRadius: 44,
          background: "linear-gradient(135deg, #f4f4f5 0%, #c9ccd6 100%)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  ),
};

export function ogPreview(slug: string): ReactElement | null {
  return PREVIEWS[slug]?.() ?? null;
}
