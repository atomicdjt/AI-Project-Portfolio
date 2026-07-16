# GardenGrid Product Design

## Purpose

GardenGrid is a local-first visual planning application for rectangular garden and raised beds. It helps gardeners understand how much space common vegetables and herbs require, arrange them at a meaningful scale, catch spacing mistakes, and produce a practical planting plan.

The first release prioritizes planning clarity over horticultural simulation. It does not require an account, backend service, or internet connection.

## Users and Success Criteria

The primary user is a home gardener planning one or more square or rectangular beds. The application succeeds when the user can:

1. Create a bed from a preset or custom dimensions.
2. Choose square-foot or traditional row planning.
3. Place plants visually and understand their required space.
4. Identify overlaps and placements that do not fit inside the bed.
5. Save the plan locally and produce a printable plan or CSV plant list.

## Product Scope

### Bed setup

- Support square and rectangular beds.
- Include common presets such as 2 x 4 ft, 3 x 6 ft, 4 x 4 ft, 4 x 8 ft, and 4 x 12 ft.
- Allow custom width and length.
- Support imperial and metric display. Store normalized dimensions internally in centimeters to avoid conversion drift.
- Allow plan name, optional notes, and planning mode selection.

### Planning modes

#### Square-foot mode

- Render a one-square-foot grid, or its metric equivalent when metric display is active.
- Use plant density guidance such as 1, 4, 9, or 16 plants per square foot.
- Snap placements to valid sub-cell positions based on the selected plant's density.
- Show the effective spacing footprint and capacity for each occupied square.

#### Row mode

- Render a scaled bed with optional grid lines.
- Place individual plants using their in-row spacing.
- Let users add horizontal or vertical rows using the plant's row-spacing recommendation.
- Snap placements to a small, unit-aware interval while preserving accurate internal coordinates.

### Plant library

Ship approximately 40 common vegetables and herbs. Each plant record contains:

- Common name and category.
- Color and simple code-native botanical icon treatment.
- Recommended plant spacing.
- Recommended row spacing.
- Square-foot density.
- Typical planting depth.
- Sun requirement.
- Approximate mature height.
- Short planning note.
- Optional companion and conflict notes when the guidance is sufficiently established.

The library will include representative leafy greens, roots, brassicas, legumes, fruiting vegetables, alliums, and herbs. Search and category filters will make the library usable without showing every plant at once.

### Visual planner

- Use a scaled, responsive bed canvas implemented with accessible HTML elements and CSS transforms rather than a bitmap canvas.
- Support drag-and-drop from the library and click-to-place as an accessible alternative.
- Support selecting, moving, duplicating, rotating rows, and deleting placements.
- Show selected-plant details and controls in an inspector.
- Display spacing footprints during placement and selection.
- Provide zoom controls for larger beds while keeping the full-bed fit option.
- Keep core placement actions keyboard accessible.

### Validation and guidance

- Mark placements that overlap another plant's minimum spacing footprint.
- Mark placements that extend beyond the bed boundary.
- Warn when row spacing is below the recommendation.
- Surface sun and mature-height guidance as informational notes rather than claiming to model shade precisely.
- Treat companion planting guidance as advisory and avoid presenting it as guaranteed scientific compatibility.
- Provide an issue list that selects the relevant placement when activated.

### Plan summary

Display live values for:

- Total plant count.
- Counts grouped by plant.
- Used planting area estimate.
- Remaining usable area estimate.
- Number of spacing or boundary issues.
- Bed dimensions and selected planning mode.

Area metrics are planning estimates derived from spacing footprints, not yield predictions.

### Persistence and exports

- Save multiple plans in browser local storage with schema versioning.
- Auto-save changes after a short debounce.
- Provide create, rename, duplicate, and delete operations.
- Include a sample starter plan on first use without overwriting user-created plans.
- Provide a print stylesheet that produces a clean bed diagram, legend, plant totals, dimensions, issues, and notes. Browser print enables PDF output.
- Export CSV with plant name, quantity, mode, spacing, coordinates or row information, and notes.
- Export and import a JSON backup so plans can be moved between browsers without a backend.

## Information Architecture

The primary desktop layout has four regions:

1. A restrained header with product identity, plan selector, save state, units, and print/export actions.
2. A left plant-library rail with search, filters, and draggable plant entries.
3. A central planning workspace with bed controls, mode controls, canvas, zoom, and contextual placement feedback.
4. A right inspector and summary rail that changes between selected-placement details, plan totals, and issues.

On tablets, the side rails become collapsible drawers. On narrow mobile screens, the planner remains functional through a tabbed Library, Bed, and Summary flow, with tap-to-place as the primary interaction.

## Visual Direction

The interface uses a warm neutral background, deep garden green text and controls, muted soil tones, and distinct botanical colors for plant categories. The bed is the visual focal point. Typography is crisp and practical, spacing is generous, and controls remain compact enough for a planning tool.

The design avoids decorative card grids and excessive rounded containers. Open rails, fine borders, a subtle paper-like workspace, and clearly drawn planting footprints create the visual identity. Motion is limited to placement previews, drawer transitions, and short validation feedback.

## Architecture

### Runtime

- React with TypeScript and Vite.
- Static local-first application with no runtime server dependency beyond the development server.
- Zustand for plan and UI state.
- Zod for persisted-data validation and migration boundaries.
- `@dnd-kit` for pointer and keyboard drag-and-drop.
- `lucide-react` for consistent interface icons.

### Module boundaries

- `domain/plants`: plant records, categories, unit-neutral spacing data, and lookup helpers.
- `domain/plans`: plan, bed, placement, row, and persisted-schema types.
- `domain/layout`: coordinate conversion, snapping, square-foot density positions, and row generation.
- `domain/validation`: pure overlap, boundary, and row-spacing checks.
- `store`: plan lifecycle, edit actions, undo/redo history, persistence, and UI selection.
- `components/library`: search, filters, and plant source controls.
- `components/planner`: bed surface, placement rendering, row rendering, interaction overlays, and zoom.
- `components/inspector`: selected item editing, summary, and issue navigation.
- `components/export`: printable report and CSV/JSON serialization.

Domain calculations remain independent from React so spacing behavior can be unit tested directly.

## Data Model

A plan contains an identifier, name, timestamps, display unit, planning mode, bed dimensions, notes, placements, and schema version. Each placement references a plant identifier and stores normalized centimeter coordinates. Row placements additionally store orientation, length, and generated plant positions.

Undo and redo use bounded snapshots of plan-editing state. Transient UI state such as open drawers, search text, zoom, and active drag data is not persisted in the plan.

## Error Handling

- Reject invalid, non-positive, or impractically large bed dimensions with inline messages.
- Validate local and imported JSON data before loading it.
- Preserve the current plan when an import fails.
- Recover from malformed local storage by retaining a downloadable copy of the raw data when possible and starting a clean store only after the user confirms.
- Prevent export when no valid plan exists and explain the required correction.
- Use an application error boundary for unexpected rendering failures.

## Accessibility

- Meet WCAG 2.2 AA contrast targets.
- Provide semantic buttons, inputs, landmarks, labels, and visible focus states.
- Provide keyboard alternatives for all drag interactions.
- Do not communicate validation by color alone; use icons, text, and an issue list.
- Announce placement, movement, deletion, and validation changes through a polite live region.
- Respect reduced-motion preferences.

## Testing and Verification

- Unit tests for unit conversion, snapping, square-foot positions, row generation, overlap checks, boundary checks, persistence migrations, and exports.
- Component tests for bed setup, plant search, placement, mode switching, inspector editing, and plan lifecycle actions.
- End-to-end tests for creating a plan, placing plants in both modes, receiving a spacing warning, saving/reloading, and exporting.
- Run TypeScript checks, lint, unit tests, production build, and end-to-end tests.
- Launch the built app locally and verify desktop and mobile layouts in the in-app browser.
- Compare the final browser screenshot against the approved visual concept before handoff.

## Delivery Boundaries

The first release will not include accounts, cloud synchronization, weather data, yield prediction, planting calendars, arbitrary bed shapes, image-based plant recognition, or collaborative editing. These can be added later without changing the core normalized plan model.

## Project Isolation

All application files, generated artifacts, documentation, dependencies, and Git history live under:

`C:\Users\Atomic\Documents\New project\garden-grid-planner`

No existing project files will be modified or overwritten.
