import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: SITE.author.name,
    title: "Copy-paste React components with motion",
    subtitle: "Loaders, switches and more. Open, copy, ship.",
  });
}
