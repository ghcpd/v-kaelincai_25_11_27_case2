# UI Test Report

This file will be updated by the test harness to summarize pass/fail statuses and the key metrics.

When run, the `tests/run_suite.js` prints a list of screenshots and traces. Playwright's own HTML report can be found under `playwright-report` if tests run.

Scenarios (from `tests/ui/ui_cases.yaml`):
- Desktop layout (header non-overlapping, CTA visible).
- 13" laptop breakpoint (no overlap at 1280x800).
- Mobile Safari (WebKit): CTA visible and clickable.
- Dark mode Markdown sanitized & styled.
- Keyboard-only navigation works across steps.

Test artifacts:
- Screenshots stored in `docs/screenshots`.
- DOM/CSS traces in `docs/screenshots/layout_trace_*.json`.
- A11y snapshots in `docs/screenshots/a11y_snapshot_*.json`.

Instructions: Run `./scripts/run_ui_suite.sh` to start mock server and dev site, then run Playwright. Review artifacts and the Playwright HTML report for details.
