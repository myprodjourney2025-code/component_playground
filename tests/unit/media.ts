import { vi } from "vitest";

/** jsdom has no matchMedia. `dark` / `reducedMotion` choose what the "browser" reports. */
export function mockMedia({
  dark = false,
  reducedMotion = false,
}: { dark?: boolean; reducedMotion?: boolean } = {}) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes("prefers-color-scheme: dark")
      ? dark
      : query.includes("prefers-reduced-motion: reduce")
        ? reducedMotion
        : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
