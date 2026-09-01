import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const server = await readFile(new URL('./server.mjs', import.meta.url), 'utf8');

test('signaling server bounds room, profile, and packet inputs', () => {
  assert.match(server, /maxPayload: 24_000/);
  assert.match(server, /function cleanRoom/);
  assert.match(server, /function cleanProfile/);
  assert.match(server, /room\.size >= roomLimit/);
  assert.match(server, /This peer identity is already connected to the room/);
});

test('signaling server only forwards signals within a joined room', () => {
  assert.match(server, /Join a room before sending signals/);
  assert.match(server, /const destination = room\.get\(message\.to\)/);
  assert.match(server, /type: 'signal', from: peerId/);
});

test('server exposes a health endpoint and same-origin WebSocket guard', () => {
  assert.match(server, /urlPath === '\/healthz'/);
  assert.match(server, /server\.listen\(port, '0\.0\.0\.0'/);
  assert.match(server, /new URL\(origin\)\.host !== request\.headers\.host/);
  assert.match(server, /HEARTHLINK_ICE_SERVERS/);
  assert.match(server, /const publicRoot = realpathSync/);
  assert.match(server, /Malformed URL path/);
  assert.match(server, /map\(\(entry\) => \(\{ urls: entry\.urls \}\)\)/);
});
