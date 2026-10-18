import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "This site has no accounts, no ads and no analytics. The only thing it stores is your theme choice, in your own browser.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="text-muted">
        Short version: this site does not ask who you are and does not track
        you.
      </p>

      <h2 className="text-xl font-semibold tracking-tight">What is stored</h2>
      <ul className="list-disc space-y-1 pl-5 text-muted">
        <li>
          If you flip the light/dark switch, your choice is saved in your
          browser&apos;s local storage under the key{" "}
          <code className="font-mono">theme</code>. It never leaves your
          device. Clear your site data to remove it.
        </li>
        <li>
          No cookies, no accounts, no forms, no advertising and no analytics
          are used.
        </li>
      </ul>

      <h2 className="text-xl font-semibold tracking-tight">
        Hosting and logs
      </h2>
      <p className="text-muted">
        Like any website, the hosting provider receives your IP address and
        browser details when pages are requested, and may keep short-term
        server logs for security and reliability. The site owner does not use
        them to identify visitors.
      </p>

      <h2 className="text-xl font-semibold tracking-tight">Other sites</h2>
      <p className="text-muted">
        Links to GitHub, X and LinkedIn leave this site. Their own privacy
        policies apply there.
      </p>

      <h2 className="text-xl font-semibold tracking-tight">
        Contact and takedowns
      </h2>
      <p className="text-muted">
        Questions, corrections, or a request to remove content (for example if
        you believe something here infringes your rights): email{" "}
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="text-foreground underline underline-offset-4"
        >
          {SITE.contactEmail}
        </a>
        . Please include the page address and what you would like changed.
      </p>

      <p className="text-sm text-muted">
        If this ever changes (for example if analytics are added), this page
        will be updated first.
      </p>
    </article>
  );
}
