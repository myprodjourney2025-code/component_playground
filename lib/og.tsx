import type { ReactElement } from "react";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

/** Social share card (LinkedIn, X, Slack...). Satori: every multi-child box needs display:flex. */
export function ogImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fafafa",
          background:
            "radial-gradient(circle at 85% 15%, #5b2bb0 0%, #1a1033 45%, #0a0a0a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#7430dc",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 100 100">
              <path
                d="M26 82 L40 68 H20 L42 46 H21 L66 18"
                fill="none"
                stroke="#fff"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#c4b5fd" }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 24 ? 84 : 104,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontSize: 36,
                color: "#d4d4d8",
                lineHeight: 1.3,
                maxWidth: 940,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
          component.samiransetua.in · Free · MIT · Copy &amp; paste
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Share card for one component: the same top and bottom lines, with the
 * component itself on white in between, like a gallery card's preview.
 */
export function ogComponentImage({
  eyebrow,
  preview,
}: {
  eyebrow: string;
  preview: ReactElement;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#7430dc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 100 100">
              <path
                d="M26 82 L40 68 H20 L42 46 H21 L66 18"
                fill="none"
                stroke="#fff"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#6d3fd0" }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {preview}
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>
          component.samiransetua.in · Free · MIT · Copy &amp; paste
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
