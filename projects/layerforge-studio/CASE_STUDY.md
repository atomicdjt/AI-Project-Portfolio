# LayerForge Studio — Case Study

## Summary

LayerForge Studio is a browser-based layered raster image editor and digital-painting application. It demonstrates real application structure, interaction-heavy UI behavior, browser graphics, local persistence, and product polish.

**Deployment status:** [Live on Vercel](https://ai-project-portfolio-layerforge-stu.vercel.app/). The static Vite build uses Vercel SPA routing.

## Problem

Many portfolio apps are simple forms or static interfaces. LayerForge is more ambitious: it recreates the conceptual foundation of a professional image editor in the browser while using an original product identity and architecture.

## Solution

The project provides a local-first creative workspace with layers, Canvas interaction, editing tools, filters, history, import/export, and persistent browser storage.

## Key Capabilities

- Layered raster editing
- HTML Canvas 2D interaction
- Brush, eraser, rectangular selection, and pan tools
- Layer add, duplicate, reorder, visibility, locking, opacity, and blend modes
- Destructive filters with command-based undo and redo
- IndexedDB project persistence and autosave
- PNG, JPEG, and WebP import
- Flattened PNG and JPEG export
- Vercel-ready static build and SPA routing

## Technical Concepts

- React
- TypeScript
- Vite
- Canvas 2D
- Zustand state management
- IndexedDB and local persistence
- Command-based history
- Modular rendering, tools, filters, and I/O layers

## Architecture Signal

React components do not own pixel algorithms directly. The UI calls state actions, the store coordinates mutations, and reusable engine modules handle rendering, brush stamping, filters, import/export, selection state, and persistence.

History commands store bounded before/after information for reversible changes. Raster projects persist as metadata plus PNG blobs in IndexedDB.

## Deployment Evidence

The app builds to `dist/` and includes `vercel.json` for direct-route SPA recovery. The recommended Vercel project uses Root Directory `apps/layerforge-studio`, Framework Preset `Vite`, Build Command `npm run build`, and Output Directory `dist`.

The recorded production deployment reported `READY`; ongoing browser regression checks should continue to cover editing, history, persistence, export, direct-route refresh, mobile layout, and console behavior.

## Portfolio Value

LayerForge is one of the strongest projects for frontend and product-implementation review because it behaves like an actual creative workspace rather than a landing-page exercise.

## What This Demonstrates for Employers

- Ability to build an interaction-heavy frontend beyond a basic form or dashboard
- Comfort with Canvas rendering, editor state, tools, history, import/export, and local persistence
- Product polish around a workspace-style UI with professional creative-tool conventions
- Understanding of browser application architecture, storage boundaries, and deployment verification
- Honest deployment evidence and clear product limitations

## Known Limitations

- Raster layers only
- No masks, adjustment layers, text layers, transform handles, or crop workflow yet
- Approximate Gaussian blur
- Stamp-based brush engine without advanced texture or tablet behavior
- MVP-scale large-canvas performance
- No dedicated automated suite for all editor commands yet

## Future Improvements

- Add automated tests for core editor commands, history, and persistence.
- Improve keyboard shortcuts and tool discoverability.
- Add richer blending and non-destructive masks.
- Improve large-image import/export edge cases.
- Add a concise workflow video focused on the editor experience.
