# Deliverables — Responsive_Onboarding_UI_v2

- frontend/ — React app under `frontend/` (TypeScript + Vite)
- docs/screenshots/ — screenshot artifacts (Populated by Playwright tests: `desktop_layout.png`, `13inch_layout.png`, `mobile_safari_cta.png`, `dark_mode_handbook.png`, `keyboard_navigation.png`)
- logs/ui_event_schema.json — structured UI log schema with session/request IDs
- tests/ui/ui_cases.yaml — YAML describing the five UI scenarios
- scripts/run_ui_suite.sh — single-command runner for Linux/Mac
- scripts/run_ui_suite.ps1 & run_tests.sh — runner for Windows PowerShell and wrapper
- package.json — handles scripts / dependencies
- setup.sh & setup.ps1 — setup & bootstrap scripts
- mocks/mock_api.json — local mock API
- tests/playwright/ui.spec.ts — Playwright tests that capture screenshots, DOM, accessibility snapshots, and structured logs
- tests/run_suite.js — Node wrapper for Playwright

To run everything locally (Quick start):
1. cd frontend
2. npm ci
3. npx playwright install
4. ./scripts/run_ui_suite.sh  # or in PowerShell: ./scripts/run_ui_suite.ps1

Outputs:
- Playwright writes screenshots to `frontend/docs/screenshots/`
- Structured event logs for each test are saved alongside screenshots (`*.logs.json`)
- DOM snapshots and accessibility snapshots (`*.dom.html`, `*.a11y.json`) are also saved in the screenshots folder

