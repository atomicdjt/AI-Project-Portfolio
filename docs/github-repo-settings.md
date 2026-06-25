# GitHub Repository Settings Checklist

The authenticated GitHub connector confirmed admin and push access to `atomicdjt/AI-Project-Portfolio-`, but the available tool surface did not expose safe repository rename, description, topic, or profile-bio update operations. Use these GitHub UI steps to complete the account-level and repository-level polish.

## Recommended Repository Description

Use this description:

```text
AI-assisted product portfolio with runnable React/TypeScript apps, local-first privacy tools, workflow systems, case studies, and employer-facing documentation.
```

Manual steps:

1. Go to `https://github.com/atomicdjt/AI-Project-Portfolio-/settings`.
2. In **General**, find the repository description field.
3. Replace the current description with the recommended description above.
4. Save changes.

## Recommended Topics

Add these topics:

```text
ai-tools
ai-workflow
portfolio
react
typescript
vite
frontend
product-prototyping
technical-operations
documentation
local-first
privacy-tools
security-ux
workflow-automation
case-studies
netlify
github-pages
```

Manual steps:

1. Go to `https://github.com/atomicdjt/AI-Project-Portfolio-`.
2. Click the gear icon next to **About** in the right sidebar.
3. Paste the description above if it is not already set.
4. Add the topics above.
5. Click **Save changes**.

## Recommended Repository Rename

Preferred new repository name:

```text
AI-Project-Portfolio
```

Manual steps:

1. Go to `https://github.com/atomicdjt/AI-Project-Portfolio-/settings`.
2. In **Repository name**, change `AI-Project-Portfolio-` to `AI-Project-Portfolio`.
3. Click **Rename** and confirm.
4. GitHub should redirect old repository links, but update documentation and external links to the new URL.
5. Check GitHub Pages after the rename. The current Pages path uses the repository name, so verify `https://atomicdjt.github.io/AI-Project-Portfolio/`.
6. Update LinkedIn, resume links, portfolio links, job applications, and any pinned profile links that use the old URL.

## Repository References Updated Before Rename

These repository-internal references already use the preferred `AI-Project-Portfolio` name and Pages path:

- `README.md`
- `docs/recruiter-quick-review.md`
- `docs/PORTS.md`
- `apps/layerforge-studio/README.md`
- `apps/layerforge-studio/vite.config.ts`
- `docs/github-profile/README.md`

`.github/workflows/deploy-layerforge.yml` does not hard-code the repository name. Do not update Netlify URLs unless the Netlify site itself changes.
