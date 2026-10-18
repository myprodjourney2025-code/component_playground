import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ZigzagTrace } from "@/experiments/loaders/zigzag-trace/component";
import { mockMedia } from "./media";

describe("ZigzagTrace", () => {
  it("announces itself as a loading status", () => {
    render(<ZigzagTrace />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toBeTruthy();
  });

  it("accepts a custom accessible label", () => {
    render(<ZigzagTrace label="Saving your work" />);
    expect(screen.getByRole("status", { name: "Saving your work" })).toBeTruthy();
  });

  it("keeps the decorative drawing hidden from assistive tech", () => {
    const { container } = render(<ZigzagTrace />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("scales with `size`", () => {
    const { container, rerender } = render(<ZigzagTrace size={64} />);
    const small = Number(container.querySelector("svg")?.getAttribute("height"));
    rerender(<ZigzagTrace size={128} />);
    const large = Number(container.querySelector("svg")?.getAttribute("height"));
    expect(large).toBeGreaterThan(small);
  });

  it("renders for people who prefer reduced motion", () => {
    mockMedia({ reducedMotion: true });
    render(<ZigzagTrace />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
