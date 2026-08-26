import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  collectImageReferences,
  validateAssetReferences,
  validatePortfolioAssets,
} from '../../scripts/validate-portfolio-assets.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicImagesDir = path.join(repositoryRoot, 'apps', 'portfolio-hub', 'public', 'images');

test('all Portfolio Hub imagePath metadata references tracked public assets', () => {
  const result = validatePortfolioAssets();
  assert.equal(result.references.length, 13);
  assert.deepEqual(result.problems, []);
});

test('asset validation rejects malformed and missing references', () => {
  const references = collectImageReferences("imagePath('../secret.png'); imagePath('missing.png');");
  const problems = validateAssetReferences({ references, publicImagesDir });
  assert.equal(problems.length, 2);
  assert.match(problems[0], /malformed local image path/);
  assert.match(problems[1], /missing from public\/images/);
});
