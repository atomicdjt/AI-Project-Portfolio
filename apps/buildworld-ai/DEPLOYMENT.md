# BuildWorld AI Deployment Authority

BuildWorld AI is a static Vite application. It requires no database or environment variables for the deterministic MVP.

## Authoritative Deployment

The standalone repository is authoritative:

- Repository: `atomicdjt/buildworld-ai`
- Branch: `main`
- Vercel project: `buildworld-ai-v01-improvements`
- Production URL: `https://buildworld-ai-v01-improvements.vercel.app/`

This monorepo workspace is maintained as portfolio-review evidence and should not be deployed as a competing product source.

## Local Production Build

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

The production output is `dist`.

## Vercel Verification

For product deployment, use the standalone repository and verify:

1. Vercel builds from the recorded `main` commit.
2. The deployment reaches `READY`.
3. The production alias resolves.
4. Studio, scenarios, cascade analysis, snapshots, reports, and import/export work.
5. Direct-route refresh and static assets succeed.
6. Browser console has no unresolved application errors.
7. The deployment commit is recorded in the release evidence.

## Static Scope

The product works without server routes. Scenarios, simulations, reports, project export/import, and deterministic insights run in the browser.

## Environment Variables

None are required.

Any future external AI provider must remain optional, isolated behind an explicit provider abstraction, and unnecessary for the deterministic demo workflow.