import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Mascot, MorphWindow } from "@/experiments/feedback/morph-window/component";
import { mockMedia } from "./media";

/** `fine` = a mouse-like pointer. `(pointer: fine)` is what the auto-focus checks. */
function mockPointer(fine: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes("pointer: fine") ? fine : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const button = () => screen.getByRole("button", { name: "Chat" });
const expanded = () => button().getAttribute("aria-expanded");
const panelOf = (el: HTMLElement) => el.closest(".mw-panel") as HTMLElement;
const mouse = { pointerType: "mouse" };

function setup(props: Partial<React.ComponentProps<typeof MorphWindow>> = {}) {
  return render(
    <MorphWindow title="Chat" {...props}>
      <p>Hello there</p>
      <input aria-label="Message" />
    </MorphWindow>,
  );
}

describe("MorphWindow: structure and accessibility", () => {
  it("is a button named by `title`, closed at first", () => {
    setup();
    expect(expanded()).toBe("false");
    expect(button().getAttribute("aria-controls")).toBeTruthy();
  });

  it("labels the window region with the title and hides it while closed", () => {
    const { container } = setup();
    const region = container.querySelector('[role="region"]') as HTMLElement;
    expect(region.getAttribute("aria-label")).toBe("Chat");
    expect(region.hasAttribute("inert")).toBe(true);
  });

  it("renders children and footer inside the window", () => {
    setup({ footer: <p>Footer text</p> });
    expect(screen.getByText("Hello there")).toBeTruthy();
    expect(screen.getByText("Footer text")).toBeTruthy();
  });

  it("uses the built-in mascot, or yours instead", () => {
    const { container, rerender } = setup();
    expect(container.querySelector("svg[viewBox]")).not.toBeNull();

    rerender(
      <MorphWindow title="Chat" mascot={<i data-testid="mine" />}>
        x
      </MorphWindow>,
    );
    expect(screen.getByTestId("mine")).toBeTruthy();
  });

  it("keeps the mascot out of the accessibility tree", () => {
    const { container } = render(<Mascot />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("is hidden until measured, then shown", () => {
    const { container } = setup();
    expect(container.querySelector(".mw-root")?.hasAttribute("data-ready")).toBe(true);
  });
});

describe("MorphWindow: opening and closing", () => {
  it("opens and closes with a click, and reports it", () => {
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    expect(onOpenChange).not.toHaveBeenCalled(); // not on first render

    fireEvent.click(button());
    expect(expanded()).toBe("true");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(button());
    expect(expanded()).toBe("false");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it("can start open", () => {
    setup({ defaultOpen: true });
    expect(expanded()).toBe("true");
  });

  it("closes on Escape and returns focus to the button", () => {
    setup();
    fireEvent.click(button());
    screen.getByLabelText("Message").focus();

    fireEvent.keyDown(screen.getByLabelText("Message"), { key: "Escape" });

    expect(expanded()).toBe("false");
    expect(document.activeElement).toBe(button());
  });

  it("closes with one press outside, even if it was opened by hover", () => {
    setup();
    fireEvent.pointerEnter(panelOf(button()), mouse);
    expect(expanded()).toBe("true");

    fireEvent.pointerDown(document.body);
    expect(expanded()).toBe("false");
  });

  it("keeps what was typed when it closes", () => {
    setup();
    fireEvent.click(button());
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "unsent draft" },
    });

    fireEvent.pointerDown(document.body);

    expect(expanded()).toBe("false");
    expect((screen.getByLabelText("Message") as HTMLInputElement).value).toBe(
      "unsent draft",
    );
  });
});

describe("MorphWindow: hover (mouse only)", () => {
  it("opens when a mouse enters, and closes shortly after it leaves", () => {
    vi.useFakeTimers();
    setup();
    const panel = panelOf(button());

    fireEvent.pointerEnter(panel, mouse);
    expect(expanded()).toBe("true");

    fireEvent.pointerLeave(panel, mouse);
    expect(expanded()).toBe("true"); // a short grace period
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(expanded()).toBe("false");
  });

  it("ignores touch and pen", () => {
    setup();
    fireEvent.pointerEnter(panelOf(button()), { pointerType: "touch" });
    expect(expanded()).toBe("false");
  });

  it("does not open on hover when openOnHover is false", () => {
    setup({ openOnHover: false });
    fireEvent.pointerEnter(panelOf(button()), mouse);
    expect(expanded()).toBe("false");

    fireEvent.click(button());
    expect(expanded()).toBe("true");
  });

  it("pins when pressed anywhere inside, so leaving no longer closes it", () => {
    vi.useFakeTimers();
    setup();
    const panel = panelOf(button());

    fireEvent.pointerEnter(panel, mouse);
    fireEvent.pointerDown(screen.getByText("Hello there"), mouse);
    fireEvent.pointerLeave(panel, mouse);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(expanded()).toBe("true");
  });

  it("stays open after leaving while focus is inside (someone is typing)", () => {
    vi.useFakeTimers();
    setup();
    const panel = panelOf(button());

    fireEvent.pointerEnter(panel, mouse);
    screen.getByLabelText("Message").focus();
    fireEvent.pointerLeave(panel, mouse);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(expanded()).toBe("true");
  });
});

describe("MorphWindow: initial focus", () => {
  it("focuses the chosen element when opened by click on a mouse device", () => {
    mockPointer(true);
    setup({ initialFocus: "input" });
    fireEvent.click(button());
    expect(document.activeElement).toBe(screen.getByLabelText("Message"));
  });

  it("does not on a touch screen (it would raise the keyboard)", () => {
    mockPointer(false);
    setup({ initialFocus: "input" });
    fireEvent.click(button());
    expect(document.activeElement).not.toBe(screen.getByLabelText("Message"));
  });

  it("does not when it is only opened by hover", () => {
    mockPointer(true);
    setup({ initialFocus: "input" });
    fireEvent.pointerEnter(panelOf(button()), mouse);
    expect(expanded()).toBe("true");
    expect(document.activeElement).not.toBe(screen.getByLabelText("Message"));
  });
});

describe("MorphWindow: customising", () => {
  it("puts `position` classes on the root", () => {
    const { container } = setup({ position: "absolute right-2 bottom-2" });
    const root = container.querySelector(".mw-root") as HTMLElement;
    expect(root.className).toContain("absolute right-2 bottom-2");
    expect(root.className).not.toContain("fixed");
  });

  it("is fixed to the page by default", () => {
    const { container } = setup();
    expect((container.querySelector(".mw-root") as HTMLElement).className).toContain(
      "fixed",
    );
  });

  it("passes colour variables through `style`", () => {
    const { container } = setup({
      style: { "--mw-from": "#059669", "--mw-to": "#0891b2" },
    });
    const root = container.querySelector(".mw-root") as HTMLElement;
    expect(root.style.getPropertyValue("--mw-from")).toBe("#059669");
    expect(root.style.getPropertyValue("--mw-to")).toBe("#0891b2");
  });

  it("adds `bodyClassName` to the scrolling area", () => {
    setup({ bodyClassName: "p-0 custom-body" });
    expect(screen.getByText("Hello there").parentElement?.className).toContain(
      "custom-body",
    );
  });
});

describe("MorphWindow: motion and styles", () => {
  it("ships a prefers-reduced-motion rule that stops the animations", () => {
    setup();
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent)
      .join("\n");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toMatch(/\.mw-float[^{]*\{\s*animation:\s*none/);
  });

  it("keeps the idle animations on transform and opacity only", () => {
    setup();
    const css = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent)
      .join("\n");
    const ring = css.match(/@keyframes mw-ring \{[\s\S]*?\n\}/)?.[0] ?? "";
    expect(ring).toContain("transform");
    expect(ring).not.toContain("box-shadow");
  });

  it("adds its CSS once, however many windows are on the page", () => {
    render(
      <>
        <MorphWindow title="One">a</MorphWindow>
        <MorphWindow title="Two">b</MorphWindow>
      </>,
    );
    const copies = Array.from(document.querySelectorAll("style")).filter((s) =>
      s.textContent?.includes(".mw-panel"),
    );
    expect(copies.length).toBe(1);
  });

  it("works with the reduced-motion preference on", () => {
    mockMedia({ reducedMotion: true });
    setup();
    fireEvent.click(button());
    expect(expanded()).toBe("true");
  });
});
