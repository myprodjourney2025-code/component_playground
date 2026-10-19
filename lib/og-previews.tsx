import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";

/**
 * The share image shows a screenshot of the component's real gallery preview,
 * captured by `npm run og:previews` into public/og/<slug>.png. A component
 * without a screenshot gets the plain title card instead.
 */
const CAPTURE_SCALE = 4; // keep in sync with scripts/og-previews.mjs
const MAX_ZOOM = 5;
const MAX_WIDTH = 900;
const MAX_HEIGHT = 330;

export function ogPreview(slug: string): ReactElement | null {
  let png: Buffer;
  try {
    png = readFileSync(path.join(process.cwd(), "public", "og", `${slug}.png`));
  } catch {
    return null;
  }
  // PNG header: width at byte 16, height at byte 20. Files are captured at 4x.
  const cssWidth = png.readUInt32BE(16) / CAPTURE_SCALE;
  const cssHeight = png.readUInt32BE(20) / CAPTURE_SCALE;
  const zoom = Math.min(MAX_ZOOM, MAX_HEIGHT / cssHeight, MAX_WIDTH / cssWidth);
  const width = Math.round(cssWidth * zoom);
  const height = Math.round(cssHeight * zoom);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>; next/image does not apply.
    <img
      src={`data:image/png;base64,${png.toString("base64")}`}
      alt=""
      width={width}
      height={height}
      style={{ width, height }}
    />
  );
}
