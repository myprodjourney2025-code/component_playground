# Zigzag Trace

- **Inspiration:** Theorem Reach app loader – purple zigzag stroke over a pale track
- **Goal:** (write in your own words)
- **Plan:** 1) trace the path 2) static track + stroke 3) animate `pathLength` 4) polish + reduced motion

## Notes
- (what did you learn?)

## Usage

`component.tsx` is self-contained: it depends only on `react` and `motion`
(no Tailwind, no other repo files), so you can copy that one file into any
React project.

```tsx
import { ZigzagTrace } from "./component";

<div style={{ width: 200, height: 200, borderRadius: 16 }}>
  <ZigzagTrace colors={{ boltLight: "#4fd1c5", boltDark: "#0f9488" }} />
</div>
```

The frame fills its parent and copies its border radius, so size and round the
parent, not the loader.

| Prop | Default | Meaning |
|---|---|---|
| `size` | `96` | Bolt height in px (width follows the aspect ratio) |
| `colors` | see `DEFAULT_COLORS` | Any of `track`, `boltLight`, `boltDark`, `metal[]`, `shadow`, `highlight`, `frame` |
| `duration` | `3.2` | Seconds for one draw → hold → erase cycle |
| `repeatDelay` | `0.4` | Rest between cycles |
| `pulse` | `true` | Tint the frame in sync with the draw |
| `label` | `"Loading"` | Accessible name (`role="status"`) |
| `className` | – | Class for the frame element |

`prefers-reduced-motion`: shows the finished bolt, no movement, no pulse.
