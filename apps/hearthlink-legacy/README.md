# HearthLink

HearthLink is a self-hostable WebRTC room application for small, private-group interaction. Its Node server serves the web application and provides WebSocket signaling; peer messages, posts, pins, reactions, and voice media then travel directly between connected browsers over WebRTC where the network permits.

## What the application provides

- A usable room workflow: join a room, switch text spaces, compose text or image messages, react, pin, publish posts, export, and clear browser-local history.
- WebSocket room discovery and WebRTC signaling for up to ten peers per room by default.
- Direct WebRTC data/media channels, optional browser-derived passphrase envelopes, and audio-channel controls.

## Deploy for your friends

The included `Dockerfile` and `render.yaml` make the app deployable as a single WebSocket-capable Node service. Connect a repository containing this directory to a Docker-capable host such as Render, Railway, Fly.io, or a VPS; do **not** deploy it as a static Vercel site. The host must proxy WebSockets and terminate HTTPS.

Set these host-side environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Host-provided | Listening port; hosts commonly set it automatically. |
| `HEARTHLINK_ROOM_LIMIT` | No | Maximum peers per room; default `10`. |
| `HEARTHLINK_ICE_SERVERS` | Recommended | JSON array of STUN/TURN server definitions supplied to joining browsers. |

For real friends on different Wi-Fi/mobile networks, configure a TURN service. A typical `HEARTHLINK_ICE_SERVERS` value contains both a STUN endpoint and your TURN endpoint. Keep long-lived TURN credentials in host configuration, never committed source; use short-lived TURN credentials in a production system when your provider supports them.

After deployment, open the same HTTPS URL in two separate browsers, join the same room name, and confirm both session headers show `online - 1/1 linked` before inviting anyone.

## Operational boundaries

HearthLink does not include authentication, persistent shared storage, moderation, backup, or a TURN relay. A hosted deployment must provide HTTPS, a reachable WebSocket endpoint, and TURN credentials if reliable connectivity across restrictive NATs is required. The server never receives room passphrases or peer message payloads.

## Run locally

Install the app-local dependency once, then start the combined application and signaling server:

```powershell
cd apps/hearthlink-legacy
npm install
npm start
```

Open `http://localhost:4173` in two browser windows using the same room name. A secure context (HTTPS or localhost) is needed for Web Crypto and microphone features.

## Enabling a real peer deployment

Run the same server behind an HTTPS-capable reverse proxy and set `PORT` to the host-provided port. The blank `signalingUrl` in `config.js` deliberately resolves to the app's own origin, so no public client-side endpoint is hard-coded. Supply TURN credentials through a private server-side configuration path; do not put credentials in `config.js`.
