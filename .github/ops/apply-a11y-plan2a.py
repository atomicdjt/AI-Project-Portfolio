from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one replacement target, found {count}")
    file.write_text(text.replace(old, new, 1), encoding="utf-8")


def replace_element(path: str, marker: str, replacement: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one semantic marker, found {count}: {marker}")
    start = text.index(marker)
    line_start = text.rfind("\n", 0, start) + 1
    indent = text[line_start:start]
    end = text.index("</div>", start) + len("</div>")
    rendered = replacement.replace("\n", "\n" + indent)
    file.write_text(text[:start] + rendered + text[end:], encoding="utf-8")


replace_once(
    "apps/portfolio-hub/src/styles.css",
    ".search-field input,\n.filters select {\n  border: 0;\n  outline: 0;\n  background: transparent;\n}\n",
    ".search-field input,\n.filters select {\n  border: 0;\n  background: transparent;\n}\n\n.search-field:focus-within {\n  border-color: #075e56;\n  box-shadow: 0 0 0 3px rgba(7, 94, 86, 0.18);\n}\n",
)

replace_element(
    "apps/redactready-pro-hri-os/src/app/App.tsx",
    '<div className="score-meter" aria-label={`${score.category}: ${score.score}`}>',
    '''<div
  className="score-meter"
  role="meter"
  aria-label={`${score.category} score`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={score.score}
  aria-valuetext={`${score.score} out of 100`}
>
  <i aria-hidden="true" style={{ width: `${score.score}%` }} />
</div>''',
)

replace_element(
    "apps/variantvision-pro/src/app/App.tsx",
    '<div className="score-meter" aria-label={`${metric.label} score ${metric.score}`}>',
    '''<div
  className="score-meter"
  role="meter"
  aria-label={`${metric.label} score`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={metric.score}
  aria-valuetext={`${metric.score} out of 100`}
>
  <i aria-hidden="true" style={{ width: `${metric.score}%` }} />
</div>''',
)

replace_once(
    "apps/scamshield-ai/src/components/layout/Header.tsx",
    '<input type="checkbox" checked={plainLanguage} onChange={(event) => setPlainLanguage(event.target.checked)} />',
    '<input aria-label="Plain-language mode" type="checkbox" checked={plainLanguage} onChange={(event) => setPlainLanguage(event.target.checked)} />',
)
replace_once(
    "apps/scamshield-ai/src/components/layout/Header.tsx",
    '<input type="checkbox" checked={caregiverMode} onChange={(event) => setCaregiverMode(event.target.checked)} />',
    '<input aria-label="Caregiver mode" type="checkbox" checked={caregiverMode} onChange={(event) => setCaregiverMode(event.target.checked)} />',
)

replace_once(
    "apps/scamshield-ai/src/test/app.test.tsx",
    "    expect(screen.getByText(/risk assessment, not a final determination/i)).toBeInTheDocument()",
    "    expect(screen.getByText(/risk assessment, not a final determination/i)).toBeInTheDocument()\n    expect(screen.getByRole('checkbox', { name: 'Plain-language mode' })).toBeInTheDocument()\n    expect(screen.getByRole('checkbox', { name: 'Caregiver mode' })).toBeInTheDocument()",
)

replace_once(
    "apps/variantvision-pro/src/index.css",
    ".workspace-primary,\n.page-stack,\n.inspector {\n  display: grid;\n  gap: 14px;\n}",
    ".workspace-primary,\n.page-stack,\n.inspector {\n  display: grid;\n  gap: 14px;\n  min-width: 0;\n}",
)
replace_once(
    "apps/variantvision-pro/src/index.css",
    ".panel {\n  background: rgba(255, 255, 255, 0.92);",
    ".panel {\n  min-width: 0;\n  background: rgba(255, 255, 255, 0.92);",
)
replace_once(
    "apps/variantvision-pro/src/index.css",
    ".table-wrap {\n  overflow-x: auto;\n}",
    ".table-wrap {\n  min-width: 0;\n  overflow-x: auto;\n}",
)

print("Plan 2A guarded source replacements applied successfully.")
