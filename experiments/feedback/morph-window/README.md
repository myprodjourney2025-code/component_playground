# Morph Window

- **Inspiration:** a floating help window from one of my own projects: a small pill that grows into a window.
- **Goal:** turn that one-off window into a component anyone can drop in. A mascot button
  that grows into a chat, assistant or help window; the content is whatever you pass in
  (`children` and `footer`); any colours; works on a phone and with a keyboard; respects
  reduced motion. I wanted to learn how to reveal a window with `clip-path` instead of
  resizing it, so the text never re-wraps while it animates.
- **Notes:** (written at launch; edit freely)
  - The closed shape is worked out from the window's real height, which is only known after
    the page loads. Until then the component is hidden, otherwise the first frame is wrong.
  - Pointer hits are clipped by `clip-path`, so the invisible part of the window never
    reacts to the mouse. Handy, but it also means a test must click the visible circle.
  - `scrollIntoView` scrolls every ancestor, even ones with `overflow-hidden`. The chat list
    scrolls itself with `scrollTop` instead.
  - Voice: `stop()` still delivers the last words afterwards, so sending uses `abort()`.
    The mic must stop when the window closes (`onOpenChange`). A plain letter cannot be a
    shortcut while typing, hence Alt+M, matched by `event.code` because Option+M types "µ".
  - Phones: inputs are 16px so iOS does not zoom, taps never use hover, and focus is not
    moved into the input on touch (it would raise the keyboard).
  - Hover opens it with a mouse, a press anywhere inside pins it, one press outside closes it
    and the typed text is kept.
  - The mascot is a temporary drawn robot. Next: a custom mascot, a controlled `open` prop,
    and a decision on the product's brand name.

## Motion notes (technical, added during the launch audit)

- **Opening and closing animate `clip-path` and `transform` on purpose.** The window is always laid out at full size and only revealed, so the text never re-wraps. `clip-path` is not a compositor-only property, so each frame of the 0.55s open or close repaints the window. That is the point of the experiment.
- **Everything that runs while it sits idle is `transform` or `opacity` only** (float, ring, shine, blink, glow). A 5 second trace of the idle button showed 0 paints, against 376 paints when the ring animated `box-shadow` (the earlier version).
- **Reduced motion:** all of it switches off under `prefers-reduced-motion: reduce`, and the window still opens and closes, just instantly.
- **Phones:** a tap opens it, a tap outside closes it, hover is never used on touch, and the input is 16px so iOS does not zoom. The on-screen keyboard can still cover a window pinned to the bottom of the screen on iOS; that is a browser limit, not handled here.
