# CI/CD

## Overview

```
pull request ──► GitHub Actions "CI"  ──► Quality  (lint, types, unit tests)
                                      └─► E2E      (build, Playwright, axe)
merge to main ─► Vercel builds and deploys production
                 └─► "Post-deploy smoke test" checks the live site
```

Vercel is already connected to the GitHub repo and the site is live, so deploys happen when `main` changes.
To make sure only tested code reaches `main`, require the CI checks on it.

## One-time setup (GitHub)

1. Repo > **Settings > Branches > Add branch protection rule** (or a Ruleset) for `main`:
   - Require a pull request before merging
   - Require status checks to pass: select **Quality** and **E2E** (they appear after the first CI run)
   - Require branches to be up to date before merging
2. Repo > **Settings > Secrets and variables > Actions > Variables**: add `SITE_URL` = `https://components.samiransetua.in` (after the domain is mapped).
   Until then the smoke test uses Vercel's deployment URL.
3. Work on a branch, open a PR, merge when green. A direct push to `main` skips the gate, so avoid it (the rule above blocks it).

## The workflows

| File | Trigger | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | PR, push to `main` | Quality job and E2E job in parallel |
| `.github/workflows/post-deploy.yml` | Vercel reports a successful **Production** deployment | Runs `tests/e2e/smoke.spec.ts` against the live site |
| `.github/dependabot.yml` | Weekly / monthly | PRs for npm and Action updates (CI tests each one) |

If the post-deploy smoke test fails, the site is already live. Roll back in the Vercel dashboard
(Deployments > previous deployment > Promote to Production), then fix forward.

## Running everything locally

```bash
npm run check && npm run test:e2e
```

## Maintenance routine

- **Weekly:** merge Dependabot PRs that are green. Read the changelog for major bumps (Next.js, React, Motion, Tailwind).
- **Per new component:** follow `docs/testing.md` (tests are required) and the PR checklist.
- **Monthly:** open the live site in Chrome, Safari and Firefox and click through the theme switch and previews. CI only runs Chromium.
- **Quarterly:** check Search Console for coverage errors and re-run Lighthouse on `/components`.
