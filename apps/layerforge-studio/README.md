# LayerForge Studio

LayerForge Studio is an original local-first browser image editor and digital painting MVP. It supports layered raster documents, image import, Canvas 2D painting, rectangular selections, destructive filters with undo, IndexedDB project persistence, and flattened PNG/JPEG export.

The project is intentionally not a Photoshop clone. It uses its own naming, layout, icons, data model, and interaction structure while implementing the broad editing categories expected from a layered raster editor.

Live demo: `https://atomicdjt.github.io/AI-Project-Portfolio/`

## Demo

![LayerForge Studio demo](../../docs/images/layerforge-demo.gif)

## Features

- Create new documents with custom width, height, and background color.
- Import PNG, JPEG, and WebP files as raster layers.
- Pan, zoom, fit-to-screen, 100% zoom, checkerboard workspace, document bounds, and pixel grid at high zoom.
- Add, delete, rename, duplicate, reorder, hide/show, lock/unlock, opacity, and blend mode controls for raster layers.
- MVP blend modes: normal, multiply, screen, overlay, darken, lighten, and difference.
- Brush and eraser tools with size, hardness, opacity, flow, color, smoothing, and patch-based undo.
- Rectangular selections stored as alpha masks, with clear and invert commands.
- Filters: brightness/contrast, invert, desaturate, Gaussian blur approximation, and sharpen.
- Undo/redo through command objects for pixel edits, filters, selections, and layer operations.
- Save/load local projects with IndexedDB. Raster layers are stored as PNG blobs.
- Autosave every 30 seconds after unsaved changes.
- Export flattened PNG with optional transparency and flattened JPEG.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS Vite plugin
- Zustand
- HTML Canvas 2D
- IndexedDB
- Lucide React icons

## Architecture

```text
src/
  app/                 App entry and routes
  editor/              Editor UI surfaces
  engine/document/     Document and layer models
  engine/render/       Canvas renderer, compositor, tile-cache placeholder
  engine/tools/        Tool controller and tool classes
  engine/brush/        Brush preset, pressure, sampling, and stamp engine
  engine/selection/    Selection alpha masks and marching ants
  engine/filters/      Image filters
  engine/history/      Command pattern and history stack
  engine/io/           Import, export, IndexedDB save/load
  state/               Zustand editor and UI stores
  components/          Dialogs and start screen
  utils/               ImageData helpers
```

React components do not directly own pixel algorithms. The UI calls Zustand actions, the store orchestrates mutations, and reusable engine modules handle rendering, brush stamping, filtering, import/export, and persistence.

## Rendering Pipeline

The MVP renderer is `Canvas2DRenderer`. It clears the viewport, draws the transparent checkerboard workspace, applies viewport pan and zoom, renders visible raster layers in document order, applies opacity and Canvas blend modes, draws document boundaries, overlays the selection boundary, and shows a pixel grid at high zoom.

Full-canvas rerendering is used for the MVP. `TileCache` is included as the extension point for dirty-region invalidation and tile rendering in a larger-document version.

## Tool System

`ToolController` registers tool classes for brush, eraser, rectangular selection, and workspace pan. Tool classes receive normalized pointer events and call editor runtime methods. This keeps pointer behavior separate from React and leaves room for crop, gradient, text, lasso, transform, and eyedropper tools.

## History Design

History uses command objects. Pixel-changing commands store affected bounds plus before/after `ImageData` patches instead of replacing the entire document. Layer and selection commands store before/after document states for the metadata they need to reverse.

Implemented command types include brush stroke, eraser stroke, filter application, add layer, delete layer, duplicate layer, reorder layer, opacity change, blend mode change, and selection change.

## Local Persistence

Projects are saved to IndexedDB under the `layerforge-studio` database. Each project record stores JSON metadata and raster layer PNG blobs. Loading reconstructs HTML canvas layers from those blobs so editing can continue after refresh.

## Known Limitations

- Only raster layers are editable in the MVP.
- Masks, adjustment layers, text layers, shape layers, transform handles, and crop are planned but not complete.
- Gaussian blur is a repeated 3x3 kernel approximation, not a high-quality separable blur.
- Brush strokes are stamp-based and do not yet include texture, scatter, tilt, or full tablet behavior.
- Selection display uses rectangular bounds; selection data is already alpha-mask based for future soft selections.
- Large-canvas performance is acceptable for MVP-sized documents, but tile rendering and workers are future work.

## Roadmap

1. Layer masks, mask painting, mask invert/feather/apply, and mask overlay.
2. Adjustment layers for brightness/contrast, levels, curves, hue/saturation, and gradient maps.
3. Transform handles for move, scale, rotate, flip, and numeric transforms.
4. Advanced brush engine with presets, texture stamps, stroke stabilization, pressure curves, and symmetry.
5. Tile rendering, OffscreenCanvas, worker filters, and WebGL/WebGPU compositing.
6. `.layerforge` file import/export as a zipped package.
7. Portfolio Mode for a process sheet showing source image, layers, major steps, and final export.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5176/
```

## Build

```bash
npm run build
npm run preview
```

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # TypeScript project build and production bundle
npm run lint     # ESLint
npm run preview  # Build and serve production preview
```

## Portfolio Case Study

LayerForge demonstrates product design and frontend engineering through a compact but credible creative-tool MVP. It has a typed document model, modular rendering pipeline, command-based state mutation, local persistence, practical import/export flows, and a dense professional UI built for repeated editing work rather than a landing-page demo.
