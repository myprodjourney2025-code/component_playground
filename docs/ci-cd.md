# CI/CD

## Branches

| Branch | Purpose | Deploys to |
| --- | --- | --- |
| `dev` (and short feature branches) | Local development | Vercel preview URL (if pushed) |
| `main` | Integration: tested work waiting for release | Vercel preview URL |
| `prod` | What is live | **Production** (components.samiransetua.in) |

```
dev ──PR──► main ──PR──► prod ──► Vercel deploys production
      CI runs        CI runs         └─► "Post-deploy smoke test" checks the live site
```

CI (`Quality` + `E2E`) runs on every pull request and on pushes to `main` and `prod`.
Production only changes when `prod` changes, and `prod` only accepts pull requests that passed CI.

## One-time setup

### Vercel
Project > **Settings > Git > Production Branch**: set it to `prod`.
All other branches then get preview deployments instead of production.

### GitHub (after the first CI run, so the check names exist)
Repo > **Settings > Branches** (or Rulesets). Add a rule for **`prod`**, and the same for **`main`**:
- Require a pull request before merging
- Require status checks to pass: **Quality** and **E2E**
- Require branches to be up to date before merging
- (`prod` only) Restrict who can push, so nothing bypasses the gate

Then add the Actions variable `SITE_URL` = `https://components.samiransetua.in` (Settings > Secrets and variables > Actions > Variables)
once the domain is mapped. Until then the smoke test uses Vercel's deployment URL.

### Creating the branches
```bash
git push origin main            # the last direct push to main
git switch -c dev
git push -u origin dev
git push origin main:prod       # creates prod from main, once
```

## Day-to-day flow

1. Work on `dev` (or a feature branch off it). `npm run check` before every commit.
2. Open a PR `dev` > `main`. CI runs. Merge when green.
3. To release: open a PR `main` > `prod`. CI runs again on the exact code that will ship. Merge when green.
4. Vercel deploys. The post-deploy smoke test checks the live site.

## The workflows

| File | Trigger | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | any PR, push to `main` or `prod` | Quality job and E2E job in parallel |
| `.github/workflows/post-deploy.yml` | Vercel reports a successful **Production** deployment | Runs `tests/e2e/smoke.spec.ts` against the live site |
| `.github/dependabot.yml` | Weekly / monthly | PRs for npm and Action updates (CI tests each one) |

If the post-deploy smoke test fails, the site is already live. Roll back in Vercel
(Deployments > previous deployment > Promote to Production), then fix forward on `dev`.

## Running everything locally

```bash
npm run check && npm run test:e2e
```

## Maintenance routine

- **Weekly:** merge Dependabot PRs that are green. Read the changelog for major bumps (Next.js, React, Motion, Tailwind).
- **Per new component:** follow `docs/testing.md` (tests are required) and the PR checklist.
- **Monthly:** open the live site in Chrome, Safari and Firefox and click through the theme switch and previews. CI only runs Chromium.
- **Quarterly:** check Search Console for coverage errors and re-run Lighthouse on `/components`.
