import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "License",
  description: `Every component on this site is free to use in personal and commercial projects under the ${SITE.license} license.`,
  alternates: { canonical: "/license" },
};

export default function LicensePage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">License</h1>
      <p className="text-muted">
        All code on this site is released under the {SITE.license} license. In
        plain words: you may use, copy, modify and ship these components in
        personal and commercial projects, with or without credit to the
        author. A link back is appreciated, never required.
      </p>

      <h2 className="text-xl font-semibold tracking-tight">What you can do</h2>
      <ul className="list-disc space-y-1 pl-5 text-muted">
        <li>Paste the code into your project and change it freely.</li>
        <li>Use it in client work and paid products.</li>
        <li>Publish your own modified versions.</li>
      </ul>

      <h2 className="text-xl font-semibold tracking-tight">One condition</h2>
      <p className="text-muted">
        If you redistribute the code itself (for example in a public
        component library), keep the copyright notice and the license text
        below.
      </p>

      <h2 className="text-xl font-semibold tracking-tight">No warranty</h2>
      <p className="text-muted">
        The code is provided &ldquo;as is&rdquo;, without warranty of any
        kind. Test components in your own project before relying on them.
      </p>

      <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed whitespace-pre-wrap">
        {`MIT License

Copyright (c) 2026 ${SITE.author.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
      </pre>

      <p className="text-sm text-muted">
        Third-party packages these components rely on (React, Motion,
        Tailwind CSS) have their own licenses.
      </p>
    </article>
  );
}
