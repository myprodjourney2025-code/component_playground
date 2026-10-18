"use client";

import { useState } from "react";
import { ThemeSwitch } from "../component";

export default function Example() {
  const [dark, setDark] = useState(false);

  return (
    <header
      className={`flex w-80 items-center justify-between rounded-xl border px-4 py-3 shadow-sm transition-colors duration-500 ${
        dark
          ? "border-zinc-700 bg-zinc-900 text-zinc-100"
          : "border-zinc-200 bg-white text-zinc-900"
      }`}
    >
      <span className="text-sm font-semibold">My app</span>
      <ThemeSwitch checked={dark} onCheckedChange={setDark} />
    </header>
  );
}
