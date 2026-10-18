import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/app/components/_components/copy-button";
import { ShareLinks } from "@/app/components/_components/share-links";
import {
  ComponentPageSkeleton,
  Skeleton,
} from "@/app/components/_components/skeletons";

describe("ShareLinks", () => {
  it("builds encoded LinkedIn and X links that open safely", () => {
    render(
      <ShareLinks
        url="https://example.com/components/a b?x=1&y=2"
        text="Hello & welcome"
      />,
    );

    const linkedin = screen.getByRole("link", { name: "LinkedIn" });
    const x = screen.getByRole("link", { name: "X" });

    expect(linkedin.getAttribute("href")).toBe(
      "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com%2Fcomponents%2Fa%20b%3Fx%3D1%26y%3D2",
    );
    expect(x.getAttribute("href")).toContain("text=Hello%20%26%20welcome");
    for (const a of [linkedin, x]) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });

  it("copies the page link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ShareLinks url="https://example.com/x" text="t" />);

    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("https://example.com/x"),
    );
    expect(await screen.findByText("Link copied ✓")).toBeTruthy();
  });
});

describe("CopyButton", () => {
  it("copies the text and confirms", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CopyButton text="npm install motion" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("npm install motion"),
    );
    expect(await screen.findByText("Copied ✓")).toBeTruthy();
  });

  it("stays quiet when the clipboard is blocked", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CopyButton text="x" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.queryByText("Copied ✓")).toBeNull();
  });
});

describe("skeletons", () => {
  it("hides the decorative block from assistive tech", () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("announces the page skeleton as busy loading", () => {
    render(<ComponentPageSkeleton />);
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByText("Loading component")).toBeTruthy();
  });
});
