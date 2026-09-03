import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('./public/app.js', import.meta.url), 'utf8');
const config = await readFile(new URL('./public/config.js', import.meta.url), 'utf8');

test('public configuration targets the co-hosted signaling service', () => {
  assert.match(config, /"demoMode": false/);
  assert.match(config, /"signalingUrl": ""/);
  assert.match(app, /return `\$\{protocol\}\/\/\$\{location\.host\}`/);
});

test('untrusted message content uses text nodes rather than HTML injection', () => {
  assert.match(app, /body\.textContent = message\.body \|\| ''/);
  assert.doesNotMatch(app, /\.innerHTML\s*=/);
});

test('room identifiers are constrained before they become storage or signaling inputs', () => {
  assert.match(app, /function sanitizeRoom/);
  assert.match(app, /replace\(\/\[\^a-z0-9_-\]\/g, ''\)/);
  assert.match(app, /\.slice\(0, 48\)/);
});

test('storage and avatar presentation degrade safely', () => {
  assert.match(app, /function readStoredValue/);
  assert.match(app, /function writeStoredValue/);
  assert.match(app, /function accentForeground/);
  assert.match(app, /applyAvatarAccent\(av,/);
});

test('remote voice tracks explicitly request audio playback after joining a shared channel', () => {
  assert.match(app, /if \(sameVoice && !state\.deafened\) \{\s+peer\.audioEl\.play\(\)\.catch/);
});

test('joining another room clears prior room content before local state loads', () => {
  assert.match(app, /state\.messages = \[\];\s+state\.posts = \[\];\s+state\.pins = \[\];\s+loadLocal\(\);/);
});
