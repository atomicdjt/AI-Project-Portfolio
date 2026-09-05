import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const origin = 'https://ai-project-portfolio-portfolio-hub.vercel.app';

for (const [route, file, heading] of [
  ['/', 'index.html', 'I turn ambiguous workflows into reviewable, local-first software.'],
  ['/review', 'review.html', 'A five-minute technical proof review.'],
]) {
  test(`${route} serves meaningful content and its own metadata without JavaScript`, async () => {
    const html = await read(`../dist/${file}`);
    assert.ok(html.includes(`<h1>${heading}</h1>`));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${route}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin}${route}"`));
    for (const slug of ['validation-ledger', 'agent-session-bridge', 'buildworld-ai', 'weavestudio']) {
      assert.ok(html.includes(`href="/projects/${slug}"`), `Missing canonical link: ${slug}`);
      assert.ok(html.includes(`href="https://github.com/atomicdjt/${slug}"`), `Missing source link: ${slug}`);
    }
    assert.doesNotMatch(html, /<div id="root"><\/div>/);
    assert.match(html, /<script type="module"[^>]*src="\/assets\//);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema.url, `${origin}${route}`);
    if (route === '/review') {
      assert.match(html, /<title>Technical proof review \| David Turner<\/title>/);
      assert.match(html, /do not claim verified revenue/);
    } else {
      assert.match(html, /They do not imply customers, revenue, broad adoption/);
      assert.match(html, /griddynamics\/rosetta\/pull\/320/);
    }
  });
}

test('review routes resolve to their rendered document before the SPA fallback', async () => {
  const { rewrites } = JSON.parse(await read('../vercel.json'));
  for (const path of ['/review', '/review/']) {
    const match = rewrites.find((rule) => rule.source === path || rule.source === '/(.*)');
    assert.equal(match?.destination, '/review.html');
  }
});

test('existing static flagship documents survive the build', async () => {
  for (const slug of ['validation-ledger', 'agent-session-bridge', 'buildworld-ai', 'weavestudio']) {
    const html = await read(`../dist/projects/${slug}.html`);
    assert.match(html, /<h1[ >]/);
    assert.ok(html.includes(`${origin}/projects/${slug}`));
  }
});
