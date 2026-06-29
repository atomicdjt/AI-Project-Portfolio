# Deployment

BuildWorld AI is a static Vite app. It requires no database and no environment variables.

Production Netlify demo: https://buildworld-ai.netlify.app/

## Local Production Build

```bash
npm install
npm run build
```

The production output is `dist`.

## Netlify

`netlify.toml` is included:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `/* -> /index.html`

Deploy:

```bash
npm run build
netlify deploy --prod --dir dist
```

Current Netlify project:

- Site name: `buildworld-ai`
- Site ID: `60b76922-d322-4887-a73b-4601a8f12e5f`
- Production URL: https://buildworld-ai.netlify.app/

## Vercel

Deploy:

```bash
npm run build
vercel --prod
```

Framework preset: Vite. Output directory: `dist`.

## Static Fallback

The product works without server routes. Scenarios, simulation, reports, project export/import, and deterministic insights run in the browser.

## Environment Variables

None required.

If an optional AI provider is added later, it should be isolated behind a provider abstraction and must not be required for demo mode.
