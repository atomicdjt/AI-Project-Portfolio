# FocusForge

FocusForge is a mobile-first productivity web app that turns uninterrupted focus sessions into a growing idle civilization. It is fully client-side, saves locally, and can be deployed as static Vite output.

## What Is Included

- 15, 25, 45, 60, and 90-minute focus campaigns
- Live gold and research generation with pause and resume
- Page Visibility distraction disasters with Barracks and Resilience mitigation
- Six civilization tiers from Hamlet through Empire
- Eight buildings with territory, cost, unlock, and maximum-count rules
- Ten preserved technologies with building unlocks and global multipliers
- Forge, Focus, Research, and Chronicle destinations
- Learned focus-window suggestions, seven-day activity heatmap, streaks, and event history
- Versioned local saves, `ff_v4` migration, JSON export/import, and guarded reset
- Responsive phone, tablet, and desktop layouts
- Reduced-motion support and keyboard-visible focus states

## Run Locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```powershell
cd "C:\Users\Atomic\Documents\New project\AI-Project-Portfolio-push\apps\focusforge"
npm install
npm run dev
```

Open [http://127.0.0.1:5179](http://127.0.0.1:5179). If that port is occupied, Vite prints the alternate local URL.

The production preview command serves the built app at [http://127.0.0.1:4179](http://127.0.0.1:4179).

## Quality Checks

```powershell
npm run lint
npm run test:run
npm run build
```

The production bundle is written to `dist/`.

## Preview The Production Build

```powershell
npm run build
npm run preview
```

## Deployment

Deploy the generated `dist/` directory to any static host, including Netlify, Vercel, Cloudflare Pages, GitHub Pages, or an ordinary web server. The app has no backend routes or secrets.

Portfolio Netlify site:

- [https://focusforge-productivity-game.netlify.app/](https://focusforge-productivity-game.netlify.app/)

Recommended build settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`

## Save Behavior

- Current game key: `focusforge:v5`
- Recoverable timer key: `focusforge:v5:timer`
- Legacy migration source: `ff_v4`
- Progress remains on the device unless exported from Chronicle.
- Active sessions recover after refresh without granting long offline income.

## Project Structure

```text
src/
  components/   Shared app shell, timer, city, icon, and modal UI
  game/         Immutable balance data, pure rules, persistence, and tests
  hooks/        Session controller and player actions
  screens/      Forge, Focus, Research, and Chronicle destinations
  utils/        Number and time formatting
docs/
  design/       Generated concept and browser verification captures
  superpowers/  Product design and implementation plan
```

## Design Reference

The visual concept is stored at `docs/design/focusforge-concept.png`. The app preserves the supplied Roman dark-fantasy identity, gold accent, balance tables, and client-only architecture while replacing the reference single component with a maintainable production structure.
