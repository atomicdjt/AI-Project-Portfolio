import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const origin = 'https://ai-project-portfolio-portfolio-hub.vercel.app';
const server = await createServer({ root, server: { middlewareMode: true, watch: null }, appType: 'custom' });

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  for (const [pathname, filename] of [['/', 'index.html'], ['/review', 'review.html']]) {
    const content = renderToString(createElement(App, { pathname }));
    assert.match(content, /<h1[ >]/, `Missing page heading for ${pathname}`);
    assert.match(template, /<div id="root"><\/div>/, 'Expected an empty build template');
    let html = template.replace('<div id="root"></div>', () => `<div id="root">${content}</div>`)
      .replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '');

    if (pathname === '/review') {
      const title = 'Technical proof review | David Turner';
      const description = 'A five-minute review of four applied AI projects: evidence-to-decision workflows, agent-trace interoperability, systems simulation, and reviewable delivery, with source and validation links.';
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*("\s*\/>)/g, `$1${description}$2`)
        .replace(/(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*("\s*\/>)/g, `$1${title}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${origin}/review$2`)
        .replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/, `$1${origin}/review$2`)
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebPage', name: title,
          url: `${origin}/review`, description, isPartOf: { '@id': `${origin}/#profile` },
        })}</script>`);
    }
    await writeFile(new URL(`../dist/${filename}`, import.meta.url), html);
    console.log(`Prerendered ${pathname}: ${Buffer.byteLength(html)} bytes`);
  }
} finally {
  await server.close();
}
