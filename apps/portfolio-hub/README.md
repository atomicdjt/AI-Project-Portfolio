# Portfolio Hub

The homepage and technical review route are rendered to HTML during the build, using the same `App` component and project data as the interactive browser application. Readers receive the portfolio content before JavaScript runs; React hydrates it to enable search, filters, and event tracking.

Run from the repository root:

```sh
npm ci
npm run build --workspace apps/portfolio-hub
npm run lint --workspace apps/portfolio-hub
npm run test:portfolio-hierarchy
```

The build renders `dist/index.html` and `dist/review.html`, validates referenced images, and tests the generated headings, source/case-study links, canonical metadata, structured data, routing, and preservation of the four existing static flagship pages. The normal CI and deployment verification commands include these checks through the workspace build.

`scripts/prerender.mjs` loads the React source through Vite at build time and closes the Vite server when done. It does not start an application server in production or initialize analytics. Keep browser-only startup in `src/main.jsx`; pass the route explicitly into `App` so it remains renderable without browser globals. The browser uses hydration for generated documents and a fresh React root for the development template.

Vercel maps `/review` and `/review/` to the generated review document before the existing SPA fallback. The explicit `/review.html` document also renders the same React route, with `/review` as its canonical URL. Existing flagship HTML pages remain separate static documents.

When adding a new rendered route, update the generation loop, metadata, route selection, Vercel routing, and generated-output tests together. HTML availability does not establish search indexing, ranking, traffic, or recruiter engagement; those require separate external evidence. Search and filtering still require JavaScript.
