# Portfolio ecosystem baseline — 2026-07-18

This is a dated, read-only baseline recorded before the 2026-07-18 portfolio-remediation changes. It is an operational record, not a claim that every historical deployment or product capability was independently retested on this date.

## Scope and safeguards

- Public GitHub account reviewed: `atomicdjt`.
- Vercel team reviewed: `atomicdjts-projects`.
- Fresh, clean clones were created for all implementation work. Existing working copies were not modified.
- The existing portfolio and QuoteForge working directories were dirty at inspection time and are expressly out of scope for this remediation branch.
- No production deployment, domain, alias, Git integration, environment variable, repository, branch, or release was removed before this baseline was written.

## GitHub repository baseline

| Repository | Visibility | Default branch | Current release/tag state | Latest observed CI | Status |
| --- | --- | --- | --- | --- | --- |
| `atomicdjt/atomicdjt` | Public | `main` | No tags or releases | No repository workflow | Active profile surface |
| `atomicdjt/AI-Project-Portfolio` | Public | `main` | `portfolio-hub-public-refresh-2026-06-28` release | Portfolio CI and Vercel affected-deployment plan passed on `f546032` | Active employer monorepo |
| `atomicdjt/buildworld-ai` | Public | `main` | No tags or releases | BuildWorld CI passed on `c51bee2` | Active standalone flagship |
| `atomicdjt/weavestudio` | Public | `master` | `v1.0.0` release and tag; `v1.0.0-rc.1` prerelease | WeaveStudio CI passed on `5b24afc` | Active standalone commercial/review product |
| `atomicdjt/quoteforge-local` | Private | `main` | Private package version `1.0.1`; tag/release status to be assessed in the private repository | Not evaluated through the public-repository inventory | Commercial standalone product |

### Branch findings

- The portfolio monorepo, profile, and BuildWorld use `main`.
- WeaveStudio has both `main` and `master`; neither is an ancestor of the other. `master` contains the released product lineage and is the current GitHub and Vercel production authority. The existing `main` cannot safely be fast-forwarded to `master`.
- The WeaveStudio migration must therefore preserve both histories and avoid force-pushing or prematurely deleting `master`.

## Local workspace baseline

| Workspace | Observation | Action taken |
| --- | --- | --- |
| `C:\\Users\\Atomic\\Documents\\New project\\AI-Project-Portfolio-push` | Dirty, including generated RedactReady Local release-package changes | Preserved; no files touched |
| `C:\\Users\\Atomic\\Documents\\New project\\quoteforge-local` | Dirty, extensive in-progress product and documentation changes, checked out on `master` | Preserved; no files touched |
| `C:\\Users\\Atomic\\Desktop\\Projects\\WeaveStudio\\01 Current Source` | Dirty on a hardening branch with local review assets | Preserved; no files touched |
| `work/portfolio`, `work/profile`, `work/buildworld-ai`, `work/weavestudio`, `work/quoteforge-local` | Fresh clones at the remote defaults | Used for isolated remediation branches only |

## Vercel baseline

All projects below reported a `READY` production deployment when inspected. `Git-connected` means the Vercel project reports a repository and production branch; it does not by itself prove that every current source route was browser-tested.

| Vercel project | Source / branch | Root | Framework / Node | Canonical production alias | Classification |
| --- | --- | --- | --- | --- | --- |
| `ai-project-portfolio-portfolio-hub` | `AI-Project-Portfolio` / `main` | `apps/portfolio-hub` | Vite / 22.x | `ai-project-portfolio-portfolio-hub.vercel.app` | Active employer hub |
| `ai-project-portfolio-opspilot-ai-operations-toolkit` | `AI-Project-Portfolio` / `main` | `apps/opspilot-ai-operations-toolkit` | Vite / 22.x | `ai-project-portfolio-opspilot-ai-op.vercel.app` | Active; public name ProcessHarbor |
| `ai-project-portfolio-redactready-pro-hri-os` | `AI-Project-Portfolio` / `main` | `apps/redactready-pro-hri-os` | Vite / 22.x | `ai-project-portfolio-redactready-pr.vercel.app` | Supporting specialization |
| `ai-project-portfolio-scamshield-ai` | `AI-Project-Portfolio` / `main` | `apps/scamshield-ai` | Vite / 22.x | `ai-project-portfolio-scamshield-ai.vercel.app` | Supporting |
| `ai-project-portfolio-redactready-local` | `AI-Project-Portfolio` / `main` | `apps/redactready-local` | Vite / 22.x | `ai-project-portfolio-redactready-lo.vercel.app` | Supporting |
| `ai-project-portfolio-layerforge-studio` | `AI-Project-Portfolio` / `main` | `apps/layerforge-studio` | Vite / 22.x | `ai-project-portfolio-layerforge-stu.vercel.app` | Supporting |
| `ai-project-portfolio-focusforge` | `AI-Project-Portfolio` / `main` | `apps/focusforge` | Vite / 22.x | `ai-project-portfolio-focusforge.vercel.app` | Supporting |
| `ai-project-portfolio-variantvision-pro` | `AI-Project-Portfolio` / `main` | `apps/variantvision-pro` | Vite / 22.x | `ai-project-portfolio-variantvision.vercel.app` | Supporting |
| `buildworld-ai-v01-improvements` | `buildworld-ai` / `main` | `/` | Vite / 22.x | `buildworld-ai-v01-improvements.vercel.app` | Active flagship; development-history name |
| `weavestudio` | `weavestudio` / `master` | `/` | Vite / 24.x | `weavestudio-nine.vercel.app` | Active commercial/review product |
| `weavestudio-demo` | `weavestudio` / hardening branch | `/` | Vite / 24.x | `weavestudio-demo.vercel.app` | Secondary demo; authority needs explicit documentation |
| `quoteforge-local` | `quoteforge-local` / `main` | `/` | Next.js / 24.x | `quoteforge-local.vercel.app` | Private commercial product |
| `source` | `quoteforge-local` / `main` | `/` | Next.js / 24.x | `source-nu-sand.vercel.app` | Duplicate-candidate; no deletion authorized |
| `ai-project-portfolio-garden-grid` | Manual / unlinked | `/` | Vite / 24.x | `ai-project-portfolio-garden-grid.vercel.app` | Controlled manual deployment |
| `mnemosyne-vercel-preview` | Manual / unlinked | `/` | Next.js / 24.x | `mnemosyne-vercel-preview.vercel.app` | Experimental / manual |
| `ai-project-portfolio-amino-workbench` | Manual / unlinked | `/` | Not detected / 24.x | `ai-project-portfolio-amino-workbenc.vercel.app` | Preserved legacy static artifact |
| `ai-project-portfolio-hearthlink` | Manual / unlinked | `/` | Not detected / 24.x | `ai-project-portfolio-hearthlink.vercel.app` | Preserved legacy static artifact |

## Risk map

| Risk | Evidence | Initial handling |
| --- | --- | --- |
| Confusing deployment identity | Several Vercel names describe historical paths instead of public products | Establish a canonical manifest and describe safe rename prerequisites before changing auto-generated domains |
| WeaveStudio branch migration | `main` and `master` have unrelated/diverged histories | Use a non-force, history-preserving PR; retain `master` as compatibility branch until production is verified |
| Profile scanability | Current profile presents six flagship cards plus several badges and extensive policy material | Reduce to exactly three employer flagships, a separate commercial section, and one review path |
| Documentation drift | Project index, deployment maps, Vercel record, recruiter guides, and profile repeat overlapping deployment facts | Make the expanded manifest authoritative and point secondary documents to it |
| QuoteForge test contract | `npm test` currently delegates only to type checking | Correct command names and add focused behavioral coverage in the isolated private clone |
| Production URL breakage | Renaming a Vercel project can affect generated `.vercel.app` addresses and existing references | Do not rename or delete projects/domains until aliases, external references, and rollback are verified |

## Initial change order

1. Expand and validate the existing `config/vercel-projects.json` instead of introducing a competing manifest.
2. Simplify the profile and main portfolio review hierarchy around BuildWorld AI, ProcessHarbor, and WeaveStudio.
3. Prepare the WeaveStudio non-force branch migration and validate it locally.
4. Correct QuoteForge's test contract and add behavior-level pricing coverage if absent.
5. Run repository checks, link checks, live HTTP/metadata checks, and focused secret/dependency scans.
6. Apply only Vercel changes that do not risk breaking canonical `.vercel.app` URLs; document deletion candidates separately.

## Rollback position

Before any external change, rollback consists of closing the isolated pull request or resetting only the isolated remediation branch. No baseline action modified production behavior.
