import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync(
  new URL('../../.github/workflows/vercel-affected-plan.yml', import.meta.url),
  'utf8',
);

function getStepBlock(name, nextName) {
  const startMarker = `      - name: ${name}`;
  const start = workflow.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing workflow step: ${name}`);

  const end = workflow.indexOf(
    `      - name: ${nextName}`,
    start + startMarker.length,
  );
  assert.notEqual(end, -1, `Missing following workflow step: ${nextName}`);

  return workflow.slice(start, end);
}

test('Vercel CLI steps execute from the monorepo root', () => {
  const vercelSteps = [
    ['Link selected Vercel project', 'Pull Vercel project configuration'],
    ['Pull Vercel project configuration', 'Build Vercel output'],
    ['Build Vercel output', 'Deploy prebuilt output'],
    ['Deploy prebuilt output', 'Smoke-check deployed document'],
  ];

  for (const [name, nextName] of vercelSteps) {
    const block = getStepBlock(name, nextName);
    assert.doesNotMatch(
      block,
      /working-directory:\s*\$\{\{\s*matrix\.path\s*\}\}/,
      `${name} must run from the monorepo root because the linked Vercel project already applies its configured Root Directory`,
    );
  }
});
