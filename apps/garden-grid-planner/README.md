# GardenGrid

GardenGrid is a local-first visual garden-bed planner for square-foot and traditional row gardening. It shows plant spacing footprints on a scaled bed, flags crowding and boundary problems, and produces printable or portable planting plans.

## Features

- Rectangular raised-bed presets and custom dimensions.
- Imperial and metric display.
- Square-foot planting positions and traditional rows.
- Curated catalog of more than 40 vegetables and herbs.
- Live spacing footprints, overlap warnings, boundary warnings, and plan totals.
- Multiple locally saved plans with rename, duplicate, delete, undo, and redo.
- Printable landscape plan with browser PDF support.
- CSV plant list plus JSON backup/import.
- Responsive desktop, tablet, and mobile planning interface.
- No account, backend, API key, or internet connection required at runtime.

## Run locally

```powershell
cd "C:\Users\Atomic\Documents\New project\garden-grid-planner"
npm install
npm run dev
```

Open the URL printed by Vite, normally [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Production build

```powershell
npm run build
npm run preview
```

The preview server normally opens at [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Verification

```powershell
npm run typecheck
npm run lint
npm test -- --run
npm run build
npx playwright install chromium
npm run e2e
```

## How planning works

1. Select a bed preset or enter custom dimensions.
2. Choose **Square foot** or **Rows**.
3. Search the plant library and select a plant.
4. Click inside the bed to add it. Row mode creates a row using that plant's in-row spacing.
5. Select a placement for details, duplication, row rotation, or deletion.
6. Review live totals and issues in the right rail.

Spacing values are practical planning guidance and can vary by cultivar, climate, trellising, pruning, and gardening method. Check seed packets and local extension guidance before planting.

## Data and privacy

Plans are stored in the browser under the `garden-grid-plans-v1` local-storage key. GardenGrid sends no plan data to a server. Use **Export > JSON backup** to move plans between browsers or retain a separate backup.

## Exports

- **Print:** opens the browser print dialog with a landscape-oriented plan, summary, issues, and notes. Choose "Save as PDF" for a PDF file.
- **Plant list CSV:** exports each placement or row with quantity, spacing, coordinates, orientation, and planting note.
- **JSON backup:** exports every saved plan in a versioned format that GardenGrid can import later.
