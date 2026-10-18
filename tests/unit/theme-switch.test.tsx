import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ThemeScript,
  ThemeSwitch,
} from "@/experiments/switches/theme-switch/component";
import { mockMedia } from "./media";

const root = document.documentElement;
const isDark = () => root.classList.contains("dark");

describe("ThemeSwitch (controlled)", () => {
  it("is an accessible switch that reflects `checked`", () => {
    const { rerender } = render(<ThemeSwitch checked={false} />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    rerender(<ThemeSwitch checked />);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("asks the parent to change, and never touches the page theme", () => {
    const onCheckedChange = vi.fn();
    render(<ThemeSwitch checked={false} onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("switch"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(isDark()).toBe(false);
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("uses a custom label", () => {
    render(<ThemeSwitch checked={false} label="Night mode" />);
    expect(screen.getByRole("switch", { name: "Night mode" })).toBeTruthy();
  });
});

describe("ThemeSwitch (site mode)", () => {
  it("toggles the dark class and remembers a deliberate override", () => {
    mockMedia({ reducedMotion: true }); // system is light
    render(<ThemeSwitch />);

    fireEvent.click(screen.getByRole("switch"));
    expect(isDark()).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("forgets the override when the choice matches the system again", () => {
    mockMedia({ reducedMotion: true });
    render(<ThemeSwitch />);

    fireEvent.click(screen.getByRole("switch")); // dark (override)
    fireEvent.click(screen.getByRole("switch")); // light = system
    expect(isDark()).toBe(false);
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("saves 'light' when the system is dark and the visitor picks light", () => {
    mockMedia({ dark: true, reducedMotion: true });
    root.classList.add("dark");
    render(<ThemeSwitch />);

    fireEvent.click(screen.getByRole("switch"));
    expect(isDark()).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reveals the new theme from the switch with a view transition", () => {
    mockMedia(); // motion allowed
    const animate = vi.fn();
    root.animate = animate as unknown as typeof root.animate;
    document.startViewTransition = vi.fn((update: () => void) => {
      update();
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(),
      };
    }) as unknown as typeof document.startViewTransition;

    render(<ThemeSwitch />);
    fireEvent.click(screen.getByRole("switch"));

    expect(document.startViewTransition).toHaveBeenCalledOnce();
    expect(isDark()).toBe(true);
  });

  it("skips the animation for people who prefer reduced motion", () => {
    mockMedia({ reducedMotion: true });
    document.startViewTransition = vi.fn() as unknown as typeof document.startViewTransition;

    render(<ThemeSwitch />);
    fireEvent.click(screen.getByRole("switch"));

    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(isDark()).toBe(true);
  });
});

describe("ThemeScript (runs before first paint)", () => {
  function runScript() {
    const { container } = render(<ThemeScript />);
    const code = container.querySelector("script")?.innerHTML ?? "";
    expect(code).toContain("prefers-color-scheme");
    new Function(code)();
  }

  it("follows a dark system when nothing is saved", () => {
    mockMedia({ dark: true });
    runScript();
    expect(isDark()).toBe(true);
  });

  it("follows a light system when nothing is saved", () => {
    mockMedia({ dark: false });
    runScript();
    expect(isDark()).toBe(false);
  });

  it("lets a saved choice beat the system", () => {
    mockMedia({ dark: true });
    localStorage.setItem("theme", "light");
    runScript();
    expect(isDark()).toBe(false);
  });
});
