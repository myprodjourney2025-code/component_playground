import { ImageResponse } from "next/og";
import { ogPreview } from "@/lib/og-previews";

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

export type OgCardItem = {
  slug: string;
  category: string;
  title: string;
  description?: string;
};

const CARD_FONT = "system-ui, sans-serif";

function Card({ item, height, large }: { item: OgCardItem; height: number; large?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        borderRadius: 28,
        background: "#18181b",
        border: "2px solid #3f3f46",
      }}
    >
      <div
        style={{
          display: "flex",
          height,
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {ogPreview(item.slug)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: large ? 36 : 28, gap: 8 }}>
        <div style={{ display: "flex", fontSize: large ? 24 : 20, letterSpacing: 3, color: "#a1a1aa", textTransform: "uppercase" }}>
          {item.category}
        </div>
        <div style={{ display: "flex", fontSize: large ? 56 : 40, fontWeight: 700, color: "#fafafa" }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{ display: "flex", fontSize: large ? 28 : 22, color: "#a1a1aa", lineHeight: 1.3 }}>
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Frame({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 48,
        gap: 24,
        fontFamily: CARD_FONT,
        background: "radial-gradient(circle at 85% 0%, #3b1a7a 0%, #140c26 50%, #0a0a0a 100%)",
      }}
    >
      {children}
      <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>{footer}</div>
    </div>
  );
}

/** Share card for one component: its gallery card, with the preview on top. */
export function ogComponentCard(item: OgCardItem) {
  return new ImageResponse(
    (
      <Frame footer="component.samiransetua.in · Free · MIT · Copy &amp; paste">
        <Card item={item} height={290} large />
      </Frame>
    ),
    OG_SIZE,
  );
}

/** Share card for the gallery: the cards as they appear on the page. */
export function ogGalleryCard(items: OgCardItem[]) {
  return new ImageResponse(
    (
      <Frame footer="component.samiransetua.in · Free copy-paste React components · MIT">
        <div style={{ display: "flex", gap: 24, flex: 1 }}>
          {items.slice(0, 2).map((item) => (
            <Card key={item.slug} item={{ ...item, description: undefined }} height={300} />
          ))}
        </div>
      </Frame>
    ),
    OG_SIZE,
  );
}
