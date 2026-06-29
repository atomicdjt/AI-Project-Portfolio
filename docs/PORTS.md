# Local Port Map

| App | Frontend | Backend |
| --- | --- | --- |
| Portfolio Hub | `http://127.0.0.1:5180/` | None |
| RedactReady | `http://127.0.0.1:5173/` | None |
| Astra | `http://127.0.0.1:5174/` | `http://127.0.0.1:3002/` |
| Nexus Play | `http://127.0.0.1:5175/` | `http://127.0.0.1:3003/` |
| LayerForge Studio | `http://127.0.0.1:5176/` | None |
| OpsPilot | `http://127.0.0.1:5177/` | None |
| ScamShield AI | `http://127.0.0.1:5178/` | None |
| FocusForge | `http://127.0.0.1:5179/` | None |
| RedactReady Pro | `http://127.0.0.1:5181/` | None |
| BuildWorld AI | `http://127.0.0.1:5183/` | None |

LayerForge Studio is assigned to `5176` because an unrelated stale local process may hold `5173` on this machine.
The Portfolio Hub is the portfolio's GitHub Pages root: `https://atomicdjt.github.io/AI-Project-Portfolio/`.
LayerForge Studio is preserved under the GitHub Pages subpath: `https://atomicdjt.github.io/AI-Project-Portfolio/layerforge-studio/`.
FocusForge is assigned to `5179` to keep it separate from the existing local apps.
RedactReady Pro is assigned to `5181` to keep it separate from the earlier RedactReady app on `5173`.
BuildWorld AI is assigned to `5183` to keep the simulation studio separate from existing live-demo app ports.
