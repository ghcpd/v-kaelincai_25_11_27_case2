Responsive_Onboarding_UI_v2 — Quick Start

1) Setup
- Run `npm ci` (or use scripts/setup.sh) to install dependencies.
- Start dev server: `npm run dev`.

2) Run UI tests
- With dev server running, run `npm run test:ui` or `sh scripts/run_ui_suite.sh`.
- Tests will capture screenshots in `docs/screenshots` and a JSON result in `docs/ui_test_results.json`.

3) Notes
- Fixes include: header non-overlap, CTA anchored above sticky footer, Markdown sanitized in dark mode, keyboard navigation and accessible attributes.

Contact: frontend lead — provide additional UI tweaks as needed.
