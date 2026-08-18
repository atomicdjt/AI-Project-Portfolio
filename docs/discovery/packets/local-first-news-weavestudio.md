# Local-First News — WeaveStudio Submission Packet

Prepared: 2026-08-16
Target: Local-First News `Apps` section

## Official contribution route

Repository: https://github.com/localfirstnews/localfirstnews

The newsletter accepts contributions by pull request to the markdown file for the current week's edition. The `Apps` section is specifically for applications built with a local-first architecture.

## Proposed entry

```markdown
### [WeaveStudio](https://weavestudio-nine.vercel.app/)
Local-first visual workflow canvas for turning fragmented notes, transcripts, research, logs, and client inputs into structured, reviewable deliverables. Workspaces stay in browser localStorage with snapshots, backup/restore, and Markdown/PDF/portable Project JSON export; optional OpenAI/Gemini assistance is BYOK and explicitly consent-gated. [Source](https://github.com/atomicdjt/weavestudio)
```

## Shorter version if the edition is crowded

```markdown
### [WeaveStudio](https://weavestudio-nine.vercel.app/)
Local-first visual workflow canvas for turning fragmented inputs into structured, reviewable deliverables. Browser-local workspaces support snapshots, backup/restore, and portable exports; optional AI assistance is BYOK and consent-gated. [Source](https://github.com/atomicdjt/weavestudio)
```

## Why it fits

- Core workspace state is stored locally in the browser.
- No account, backend, or cloud database is required for the normal workflow.
- Users can export owned data and restore validated backups.
- Optional provider calls are not part of the normal workflow and require explicit consent.
- The project documents that localStorage is not equivalent to encryption or durable storage.
- The application is public and usable now.

## Boundaries

Do not describe WeaveStudio as:

- offline-first under every condition—the public app still needs to be loaded and optional provider features require network access;
- encrypted local storage;
- a synchronized multi-device application;
- proven by user/customer adoption;
- open source—the repository is public for evaluation but uses a proprietary all-rights-reserved license.

## Submission steps

1. Check the current `editions/` file and contribution deadline immediately before submission.
2. Fork `localfirstnews/localfirstnews` from David's GitHub account if no writable fork exists.
3. Add the entry under the current edition's `Apps` section using the repository's existing style.
4. Keep the PR limited to the single app entry.
5. PR title suggestion: `Add WeaveStudio to Apps`.
6. PR body suggestion: `Adds WeaveStudio, a browser-local visual workflow canvas with portable exports and optional consent-gated BYOK AI, to the Apps section.`
7. Do not ask for stars, votes, promotion, or special placement.
8. Record the newsletter/PR URL in the discovery ledger only after the contribution is public.

## Current blocker

The connected GitHub account can read `localfirstnews/localfirstnews` but does not have upstream push permission, and the available GitHub connector does not expose a fork-creation action. The submission text is therefore ready, but the account-bound fork step remains manual unless a writable fork is created through GitHub first.