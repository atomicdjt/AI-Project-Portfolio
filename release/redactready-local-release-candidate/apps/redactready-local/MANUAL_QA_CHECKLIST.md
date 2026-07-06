# RedactReady Local Manual QA Checklist

Use synthetic fixtures from `samples/` and `public/samples/` first. Do not use real sensitive documents in a public demo unless the deployment and privacy model have been independently verified.

## Browser Setup

- Run `npm install`.
- Run `npm run build`.
- Run `npm run preview`.
- Open the Vite preview URL shown in the terminal.
- Test at desktop and mobile viewport widths.

## Desktop QA

- Landing page shows "Redact before you upload."
- Primary CTA opens `/redact`; secondary CTA opens `/about`.
- `/redact` shows the demo banner, file picker, supported extensions, and 50MB local limit.
- Start Here walkthrough shows six workflow steps.
- Navigation and browser back/forward behavior do not break app state.
- Unknown routes fall back without crashing.

## Mobile QA

- Header, navigation, hero copy, preview panel, use-case cards, workspace panels, and CTA areas do not overlap.
- Buttons remain tappable and text remains readable.
- Detection, canvas, and export panels stack in a usable order.
- Checklist labels wrap without clipping.

## PDF QA

- Upload a synthetic PDF or test fixture.
- Confirm selectable text findings appear when a text layer exists.
- Confirm PDF findings with geometry are labeled as approximate where relevant.
- Draw, move, resize, and delete a manual box.
- Export downloads a flattened PDF with approved boxes painted into page images.
- Open the exported PDF and inspect page order, redaction placement, hidden text risk, metadata notes, and loss of selectable text.

## Image QA

- Upload PNG and JPG/JPEG samples.
- Confirm image warnings mention opt-in OCR and manual boxes for faces, signatures, IDs, and visual content.
- Confirm approved boxes are painted into the downloaded PNG.
- Confirm barcode/QR warning appears when `BarcodeDetector` is unavailable.

## TXT / CSV QA

- Upload `samples/sample-sensitive.txt`.
- Load each one-click synthetic sample from the upload screen.
- Confirm possible findings use cautious labels.
- Confirm TXT export replaces approved findings with redaction tokens.
- Confirm CSV export preserves a CSV-like file and manually verify columns, quoting, formulas, and downstream import behavior.
- Confirm no-findings state says absence of findings does not mean safe to share.

## OCR QA

- Run OCR on a PDF or image.
- Confirm experimental OCR status/progress appears.
- Confirm OCR findings are marked as experimental and require manual verification.
- Confirm OCR failure copy tells users to continue with visual review and manual boxes.
- Confirm OCR-derived placements are visually checked before export.

## Export QA

- Export file button is disabled before checklist acknowledgement.
- Checklist wording changes for PDF, image, TXT, CSV, and unknown files.
- Check all acknowledgement boxes.
- Export file button becomes enabled.
- Warning still tells the user to manually open and inspect the export.
- Post-export summary shows file type, redaction count, reviewed findings, rejected/ignored findings, manual boxes, OCR status, and metadata handling.

## Report QA

- Export redaction log downloads JSON.
- JSON report excludes raw sensitive values.
- JSON report includes categories, counts, OCR status, metadata handling, verification status, warnings, and manual box counts.

## Claims QA

- No claim of guaranteed detection.
- No claim of complete redaction.
- No claim of HIPAA, FERPA, FOIA, GDPR, legal, medical, security, or compliance certification.
- Claims remain assistive, human-review-based, and limitation-aware.

## Accessibility QA

- File input, sample buttons, OCR button, manual box controls, checklist inputs, and export buttons are keyboard reachable.
- Focus states are visible.
- Buttons and form controls have accessible labels or visible text.
- Warning/status messages are readable and not color-only.
- Text remains legible at mobile widths and browser zoom.

## Release Blockers

- Any claim of guaranteed detection or complete redaction.
- Any claim of HIPAA, FERPA, FOIA, GDPR, legal, medical, security, or compliance certification.
- Export file enabled before checklist acknowledgement.
- Raw sensitive values included in the JSON report.
- Broken build, lint, tests, or e2e smoke test.
