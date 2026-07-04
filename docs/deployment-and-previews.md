# Deployment and Preview Map

Last audited: July 4, 2026.

This portfolio uses two deployment patterns:

- **GitHub Pages** for the public portfolio hub and the LayerForge Studio subpath.
- **App-level Netlify projects** for standalone static demos.

The repository root is not currently linked to a Netlify project. `npx netlify status` from the repo root reports an authenticated Netlify user, then warns that the folder is not linked to a project. Treat Netlify deployment as app-level unless a root site is explicitly linked later.

## GitHub Pages

| Surface | URL | Source | Deployment trigger |
| --- | --- | --- | --- |
| Portfolio Hub | `https://atomicdjt.github.io/AI-Project-Portfolio/` | `apps/portfolio-hub` | `.github/workflows/deploy-layerforge.yml` on `main` |
| LayerForge Studio | `https://atomicdjt.github.io/AI-Project-Portfolio/layerforge-studio/` | `apps/layerforge-studio` | Copied into the Pages artifact by `.github/workflows/deploy-layerforge.yml` |

GitHub Pages production deployment should happen only after a reviewed PR is merged into `main` and CI passes.

## Confirmed Netlify Projects

These Netlify projects were confirmed through the Netlify connector on July 4, 2026. Each project reported `currentDeploy.state = ready` and no password or SSO access control.

Netlify account-level project descriptions were also updated on July 4, 2026 so the Netlify dashboard metadata matches the public portfolio positioning.

| Project | Public URL | Local source in this repo | Build command | Publish directory |
| --- | --- | --- | --- | --- |
| `buildworld-ai` | `https://buildworld-ai.netlify.app/` | `apps/buildworld-ai` | `npm run build` | `dist` |
| `redactready-pro-hri-os` | `https://redactready-pro-hri-os.netlify.app/` | `apps/redactready-pro-hri-os` | `npm run build` | `dist` |
| `redactready-local` | `https://redactready-local.netlify.app/` | `apps/redactready-local` | `npm run build` | `dist` |
| `scamshield-ai-safety` | `https://scamshield-ai-safety.netlify.app/` | `apps/scamshield-ai` | `npm run build` | `dist` |
| `opspilot-ai-operations-toolkit` | `https://opspilot-ai-operations-toolkit.netlify.app/` | `apps/opspilot-ai-operations-toolkit` | `npm run build` | `dist` |
| `focusforge-productivity-game` | `https://focusforge-productivity-game.netlify.app/` | `apps/focusforge` | `npm run build` | `dist` |
| `variantvisionpro` | `https://variantvisionpro.netlify.app/` | `apps/variantvision-pro` | `npm run build` | `dist` |

Supplemental Netlify demos also resolved with HTTP 200 and were visible in the Netlify account, but they are not currently maintained as runnable app folders in this portfolio repo:

| Project | Public URL | Repo status |
| --- | --- | --- |
| `aminoacidworkbench` | `https://aminoacidworkbench.netlify.app/` | Concept documentation in `projects/amino-acid-research-workbench` |
| `garden-grid-planner-demo` | `https://garden-grid-planner-demo.netlify.app/` | Source not present in this repo |
| `hearthlink-p2p-demo` | `https://hearthlink-p2p-demo.netlify.app/` | Source not present in this repo |

## Pull Request Preview Policy

Prefer pull requests and preview deployments over direct production deploys.

1. Create a feature branch.
2. Run `npm run verify:release` from the repo root.
3. Open a PR into `main`.
4. Let GitHub Actions validate the PR.
5. If a Netlify app is connected to the Git repository with deploy previews enabled, use the Netlify PR preview for review.
6. If the app is not Git-connected or the repo root is not linked, create a manual preview from the app folder:

```bash
cd apps/<app-name>
npx netlify link
npx netlify deploy --build
```

Do not use `--prod` for review previews.

## Production Publish Steps

After PR review and approval:

```bash
git checkout main
git pull
npm run verify:release
gh pr merge <PR_NUMBER> --merge --delete-branch
git pull
```

For GitHub Pages, the merge to `main` triggers the Pages workflow.

For a Netlify app that needs a manual production deploy:

```bash
cd apps/<app-name>
npx netlify link
npx netlify deploy --build --prod
```

After production deploy, verify the public URL with `curl.exe -L -s -o NUL -w "%{http_code} %{url_effective}" <url>` and perform a browser smoke check for the core workflow.
