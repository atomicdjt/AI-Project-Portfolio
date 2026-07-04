# GitHub Profile README Setup

Last audited: July 4, 2026.

The profile README repository exists locally at:

```text
C:\Users\Atomic\Documents\New project\atomicdjt
```

The public repository is:

```text
https://github.com/atomicdjt/atomicdjt
```

Use `docs/github-profile/README.md` as the portfolio-maintained draft, then keep the live profile repo synchronized when flagship rankings, live-demo links, or recruiter-facing positioning changes.

## Update The Live Profile README

1. Open the local profile repo:

```bash
cd "C:\Users\Atomic\Documents\New project\atomicdjt"
```

2. Replace `README.md` with the current draft from:

```text
C:\Users\Atomic\Documents\New project\AI-Project-Portfolio-push\docs\github-profile\README.md
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
AI-assisted product builder focused on workflow systems, privacy-first tools, technical operations, and employer-ready software prototypes.
```

Manual steps:

1. Go to `https://github.com/atomicdjt`.
2. Click **Edit profile**.
3. Replace the current bio with the recommended bio above.
4. Click **Save**.
