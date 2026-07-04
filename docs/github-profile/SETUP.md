# GitHub Profile README Setup

Last audited: July 4, 2026.

The public repository is:

```text
https://github.com/atomicdjt/atomicdjt
```

Use `docs/github-profile/README.md` as the portfolio-maintained draft, then keep the live profile repo synchronized when flagship rankings, live-demo links, or recruiter-facing positioning changes.

## Update The Live Profile README

1. Open the local profile repo:

```bash
cd ../atomicdjt
```

2. Replace `README.md` with the current draft from:

```text
docs/github-profile/README.md
```

3. Review the diff:

```bash
git diff -- README.md
```

4. Commit and push on a review branch:

```bash
git checkout -b portfolio-audit-upgrade
git add README.md
git commit -m "Improve portfolio profile README positioning"
git push -u origin portfolio-audit-upgrade
gh pr create --base main --head portfolio-audit-upgrade --title "Improve portfolio profile README positioning" --body "Refreshes the GitHub profile README so it leads with the current flagship portfolio projects, live demos, and review paths."
```

## Recommended GitHub Profile Bio

Use this bio:

```text
Applied AI workflow and technical-ops builder shipping deployed local-first tools with documented CI, tests, and case studies.
```

Manual steps:

1. Go to `https://github.com/atomicdjt`.
2. Click **Edit profile**.
3. Replace the current bio with the recommended bio above.
4. Set the website field to `https://atomicdjt.github.io/AI-Project-Portfolio/`.
5. Click **Save**.

## Current Account-Level Settings

Applied on July 4, 2026:

- Display name: `David Turner`
- Profile website: `https://atomicdjt.github.io/AI-Project-Portfolio/`
- Hireable flag: enabled
- Profile bio: `Applied AI workflow and technical-ops builder shipping deployed local-first tools with documented CI, tests, and case studies.`
- Profile README repository homepage: `https://atomicdjt.github.io/AI-Project-Portfolio/`
- Profile README repository topics: `github-profile`, `portfolio`, `readme`, `applied-ai`, `technical-operations`
- `buildworld-ai` repository topics: `ai`, `systems-simulation`, `graph-simulation`, `data-visualization`, `react`, `typescript`, `vite`, `netlify`, `local-first`, `portfolio`

## Recommended Pinned Repositories

GitHub profile pinning is account UI-managed when no API mutation is available. Use this order:

1. `AI-Project-Portfolio`
2. `buildworld-ai`
3. `atomicdjt`
