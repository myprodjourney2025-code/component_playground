"use client";

import { useEffect, useState } from "react";
import { ThemeSwitch } from "../component";

export default function Example() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Skip the auto-play for people who asked for less motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setDark((d) => !d), 2200);
    return () => clearInterval(id);
  }, []);

  // Controlled: this switch never touches the page's theme.
  return <ThemeSwitch checked={dark} onCheckedChange={setDark} />;
}
