import assert from 'node:assert/strict';
import test from 'node:test';

import { verifySourceCheckout } from '../verify-source-checkout.mjs';

const expectedSourceSha = '0123456789abcdef0123456789abcdef01234567';

test('accepts a clean checkout at the expected source SHA', () => {
  assert.deepEqual(
    verifySourceCheckout({ expectedSourceSha, actualSourceSha: expectedSourceSha, status: '' }),
    {
      schemaVersion: 1,
      expectedSourceSha,
      actualSourceSha: expectedSourceSha,
      clean: true,
    },
  );
});

test('rejects tracked source changes', () => {
  assert.throws(
    () => verifySourceCheckout({
      expectedSourceSha,
      actualSourceSha: expectedSourceSha,
      status: ' M apps/portfolio-hub/src/App.jsx',
    }),
    /clean/i,
  );
});

test('rejects untracked source changes', () => {
  assert.throws(
    () => verifySourceCheckout({
      expectedSourceSha,
      actualSourceSha: expectedSourceSha,
      status: '?? unexpected-source-file.txt',
    }),
    /clean/i,
  );
});

test('rejects a checked-out SHA that does not match the triggering SHA', () => {
  assert.throws(
    () => verifySourceCheckout({
      expectedSourceSha,
      actualSourceSha: 'fedcba9876543210fedcba9876543210fedcba98',
      status: '',
    }),
    /does not match/i,
  );
});
