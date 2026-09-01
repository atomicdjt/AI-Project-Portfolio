# HearthLink legacy migration

This directory began as the static production artifact served by Netlify at `https://hearthlink-p2p-demo.netlify.app/` on July 16, 2026.

The original editable source project was not available locally during the migration. The recovered browser client now has a maintained self-hosting path in `server.mjs`; it serves the static application and implements the signaling protocol expected by `app.js`.

`config.js` resolves an empty signaling URL to the application's own origin. Running `npm start` within this directory starts an operational local signaling service. Any retained static-only deployment remains non-operational until it is replaced with a host that runs the Node server.
