import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';

const port = Number.parseInt(process.env.PORT || '4173', 10);
const roomLimit = Number.parseInt(process.env.HEARTHLINK_ROOM_LIMIT || '10', 10);
const root = process.cwd();
const rooms = new Map();
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.png', 'image/png'], ['.svg', 'image/svg+xml']
]);

function cleanRoom(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').slice(0, 48);
}

function cleanProfile(profile = {}) {
  return {
    id: String(profile.id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80),
    name: String(profile.name || 'Guest').trim().slice(0, 40) || 'Guest',
    accent: /^#[0-9a-fA-F]{6}$/.test(profile.accent || '') ? profile.accent : '#c85836',
    status: 'online',
    voiceChannel: ''
  };
}

function iceServers() {
  const fallback = [{ urls: 'stun:stun.l.google.com:19302' }];
  if (!process.env.HEARTHLINK_ICE_SERVERS) return fallback;
  try {
    const parsed = JSON.parse(process.env.HEARTHLINK_ICE_SERVERS);
    if (!Array.isArray(parsed)) throw new Error('ICE servers must be an array.');
    return parsed
      .filter((entry) => entry && (typeof entry.urls === 'string' || Array.isArray(entry.urls)))
      .slice(0, 8);
  } catch {
    console.warn('Ignoring invalid HEARTHLINK_ICE_SERVERS configuration.');
    return fallback;
  }
}

function send(ws, message) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

function removePeer(ws) {
  const { roomId, peerId } = ws.hearthlink || {};
  if (!roomId || !peerId) return;
  ws.hearthlink = null;
  const room = rooms.get(roomId);
  if (!room) return;
  room.delete(peerId);
  if (room.size === 0) rooms.delete(roomId);
  else for (const peer of room.values()) send(peer, { type: 'peer-left', peerId });
}

const server = createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const urlPath = new URL(request.url || '/', 'http://localhost').pathname;
  if (urlPath === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
      .end(JSON.stringify({ status: 'ok', rooms: rooms.size }));
    return;
  }
  if (urlPath === '/config.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
      .end(`window.HEARTHLINK_CONFIG = ${JSON.stringify({ appName: 'HearthLink P2P', signalingUrl: '', iceServers: iceServers(), roomSizeLimit: roomLimit, maxImageBytes: 1_500_000, demoMode: false })};`);
    return;
  }
  const requested = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath).replace(/^\/+/, '');
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': mimeTypes.get(extname(filePath)) || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  if (request.method === 'HEAD') response.end(); else createReadStream(filePath).pipe(response);
});

const wss = new WebSocketServer({ server, maxPayload: 24_000 });
wss.on('connection', (ws, request) => {
  const origin = request.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.host) { ws.close(1008, 'Cross-origin WebSocket connections are not allowed.'); return; }
    } catch { ws.close(1008, 'Invalid Origin header.'); return; }
  }
  ws.on('message', (raw) => {
    let message;
    try { message = JSON.parse(raw.toString()); } catch { send(ws, { type: 'error', message: 'Invalid signaling payload.' }); return; }
    if (!message || typeof message.type !== 'string') return;

    if (message.type === 'join') {
      removePeer(ws);
      const roomId = cleanRoom(message.roomId);
      const profile = cleanProfile(message.profile);
      if (!roomId || !profile.id) { send(ws, { type: 'error', message: 'A valid room and profile are required.' }); return; }
      const room = rooms.get(roomId) || new Map();
      if (!room.has(profile.id) && room.size >= roomLimit) { send(ws, { type: 'error', message: `This room is limited to ${roomLimit} peers.` }); return; }
      const peers = [...room.entries()].map(([id, peer]) => ({ id, ...peer.hearthlink.profile }));
      room.set(profile.id, ws); rooms.set(roomId, room);
      ws.hearthlink = { roomId, peerId: profile.id, profile };
      send(ws, { type: 'joined', selfId: profile.id, peers, config: { iceServers: [] } });
      for (const peer of room.values()) if (peer !== ws) send(peer, { type: 'peer-joined', peer: { id: profile.id, ...profile } });
      return;
    }

    const { roomId, peerId } = ws.hearthlink || {};
    const room = rooms.get(roomId);
    if (!room || !peerId) { send(ws, { type: 'error', message: 'Join a room before sending signals.' }); return; }
    if (message.type === 'profile-update') {
      const profile = cleanProfile({ ...ws.hearthlink.profile, ...message.profile, id: peerId });
      ws.hearthlink.profile = profile;
      for (const peer of room.values()) if (peer !== ws) send(peer, { type: 'profile-update', peerId, profile });
      return;
    }
    if (message.type === 'signal' && typeof message.to === 'string' && message.signal && typeof message.signal === 'object') {
      const destination = room.get(message.to);
      if (destination) send(destination, { type: 'signal', from: peerId, signal: message.signal });
    }
  });
  ws.on('close', () => removePeer(ws));
  ws.on('error', () => removePeer(ws));
});

server.listen(port, () => console.log(`HearthLink is listening on http://127.0.0.1:${port}`));
