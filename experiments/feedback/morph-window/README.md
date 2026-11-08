# Morph Window

- **Inspiration:** Today's forecast window in the Bhagyam dashboard (a pill that grows into a window).
- **Goal:**
- **Notes:**

## Motion notes (technical, added during the launch audit)

- **Opening and closing animate `clip-path` and `transform` on purpose.** The window is always laid out at full size and only revealed, so the text never re-wraps. `clip-path` is not a compositor-only property, so each frame of the 0.55s open or close repaints the window. That is the point of the experiment.
- **Everything that runs while it sits idle is `transform` or `opacity` only** (float, ring, shine, blink, glow). A 5 second trace of the idle button showed 0 paints, against 376 paints when the ring animated `box-shadow` (the earlier version).
- **Reduced motion:** all of it switches off under `prefers-reduced-motion: reduce`, and the window still opens and closes, just instantly.
- **Phones:** a tap opens it, a tap outside closes it, hover is never used on touch, and the input is 16px so iOS does not zoom. The on-screen keyboard can still cover a window pinned to the bottom of the screen on iOS; that is a browser limit, not handled here.
