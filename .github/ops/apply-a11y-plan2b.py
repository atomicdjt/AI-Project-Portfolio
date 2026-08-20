from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one replacement target, found {count}")
    file.write_text(text.replace(old, new, 1), encoding="utf-8")


replace_once(
    "apps/opspilot-ai-operations-toolkit/src/styles.css",
    ".search-box input {\n  width: 100%;\n  min-width: 0;\n  border: 0;\n  outline: 0;\n  background: transparent;\n}",
    ".search-box input {\n  width: 100%;\n  min-width: 0;\n  border: 0;\n  background: transparent;\n}\n\n.search-box:focus-within {\n  border-color: var(--teal-dark);\n  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.16);\n}",
)

replace_once(
    "apps/layerforge-studio/src/index.css",
    ".recent-select select,\n.select-control select {\n  min-width: 92px;\n  border: 0;\n  outline: 0;\n  color: inherit;\n  background: transparent;\n}",
    ".recent-select select,\n.select-control select {\n  min-width: 92px;\n  border: 0;\n  color: inherit;\n  background: transparent;\n}",
)

replace_once(
    "apps/redactready-pro-hri-os/src/app/App.tsx",
    '<div className="session-status">',
    '<div className="session-status" tabIndex={0} aria-label="Session status">',
)
replace_once(
    "apps/redactready-pro-hri-os/src/index.css",
    ".session-status span {",
    ".session-status:focus-visible {\n  outline: 2px solid var(--teal);\n  outline-offset: 2px;\n}\n\n.session-status span {",
)

replace_once(
    "apps/variantvision-pro/src/index.css",
    ".search-box input {\n  width: 100%;\n  border: 0;\n  background: transparent;\n  color: #ffffff;\n  outline: 0;\n}",
    ".search-box input {\n  width: 100%;\n  border: 0;\n  background: transparent;\n  color: #ffffff;\n}",
)
replace_once(
    "apps/variantvision-pro/src/index.css",
    ".case-list small {\n  font-weight: 900;\n  color: #e1b85f;\n}",
    ".case-list small {\n  font-weight: 900;\n  color: #e1b85f;\n}\n\n.case-list button.active small {\n  color: #735400;\n}",
)
replace_once(
    "apps/variantvision-pro/src/index.css",
    "  background: #19b8aa;\n  color: #ffffff;",
    "  background: #0f766e;\n  color: #ffffff;",
)
replace_once(
    "apps/variantvision-pro/src/index.css",
    "    background: #149388;",
    "    background: #0b5f59;",
)

replace_once(
    "apps/portfolio-hub/src/styles.css",
    ".card-meta {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  color: #6b7a80;\n  font-size: 0.78rem;\n}",
    ".card-meta {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  color: #637177;\n  font-size: 0.78rem;\n}",
)

replace_once(
    "apps/scamshield-ai/src/styles.css",
    ".app-footer p { margin: 0; }",
    ".app-footer p { margin: 0; }\n.app-footer a { color: #7fd3ff; }",
)
replace_once(
    "apps/scamshield-ai/src/styles.css",
    "color: #6a7b82; background: transparent;",
    "color: #637177; background: transparent;",
)
replace_once(
    "apps/scamshield-ai/src/styles.css",
    "color: #6b7d84; background: #edf1ef;",
    "color: #52656d; background: #edf1ef;",
)

print("Plan 2B guarded source replacements applied successfully.")
