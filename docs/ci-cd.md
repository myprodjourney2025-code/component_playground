# CI/CD

## Branches

| Branch | Purpose | Deploys to |
| --- | --- | --- |
| `dev` (and short feature branches off it) | Local development | Vercel preview URL, if pushed |
| `main` | What is live | **Production** (components.samiransetua.in) |

```
dev ──PR──► main ──► Vercel deploys production
      CI runs        └─► "Post-deploy smoke test" checks the live site
```

CI (`Quality` + `E2E`) runs on every pull request and on pushes to `main`.
Production only changes when `main` changes, and `main` only accepts pull requests that passed CI.

## One-time setup

### Vercel
Project > **Settings > Git > Production Branch** should be `main` (the default).
Every other branch, such as `dev`, gets a preview deployment, not production.

### GitHub (after the first CI run on a pull request, so the check names exist)
Repo > **Settings > Branches** (or Rulesets). Add a rule for **`main`**:
- Require a pull request before merging
- Require status checks to pass: **Quality** and **E2E**
- Require branches to be up to date before merging
- Do not allow bypassing, so even admins go through a PR

Then add the Actions variable `SITE_URL` = `https://components.samiransetua.in` (Settings > Secrets and variables > Actions > Variables)
once the domain is mapped. Until then the smoke test uses Vercel's deployment URL.

## Day-to-day flow

1. Work on `dev`. Run `npm run check` before every commit; push `dev` whenever you like (you get a preview URL).
2. To release, open a PR `dev` > `main` on GitHub. CI runs the full suite. Merge when green.
3. Vercel deploys `main` to production. The post-deploy smoke test checks the live site.
4. Back on `dev`, bring it up to date: `git switch dev && git pull origin main` (or `git merge origin/main`).

Never commit straight to `main` once branch protection is on; the rule blocks it.

## The workflows

| File | Trigger | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | any PR, push to `main` | Quality job and E2E job in parallel |
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
