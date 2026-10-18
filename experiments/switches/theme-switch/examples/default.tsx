"use client";

import { useState } from "react";
import { ThemeSwitch } from "../component";

export default function Example() {
  const [dark, setDark] = useState(false);

  // Pass `checked` to control it yourself. Omit it and the switch drives the
  // site theme: <ThemeSwitch />
  return <ThemeSwitch checked={dark} onCheckedChange={setDark} />;
}
