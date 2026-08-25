import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const appPath = new URL('../../apps/portfolio-hub/src/App.jsx', import.meta.url);

test('interactive catalogue and technical review path include every core technical flagship', async () => {
  const app = await readFile(appPath, 'utf8');

  for (const flagship of [
    'Validation Ledger',
    'Agent Session Bridge',
    'BuildWorld AI',
    'WeaveStudio',
  ]) {
    assert.match(app, new RegExp(`publicName: '${flagship}'`));
  }

  assert.match(app, /const technicalFlagships = projects\.filter/);
  assert.match(app, /technicalFlagships\.map/);
});
