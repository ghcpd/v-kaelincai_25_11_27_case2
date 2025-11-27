# Responsive_Onboarding_UI_v2

This project contains a minimal React (TypeScript) onboarding wizard demonstrating responsive layout fixes, CTA anchoring, Markdown sanitization, and automated UI tests using Playwright.

## Quick start
- Install dependencies: npm ci
- Install Playwright browsers: npx playwright install
- Run UI suite: npm run test:ui (runs Playwright tests and ships screenshots and logs)

## Files of interest
- `src/components/Wizard.tsx` — onboarding wizard logic & structured logs
- `src/components/Wizard.module.css` — responsive styles and CTA/footers
- `tests/playwright/ui.spec.ts` — Playwright tests scenarios & assertions
- `mocks/mock_api.json` — local mock API content
- `logs/ui_event_schema.json` — UI event logging JSON schema
- `docs/screenshots/` — folder where screenshots, DOM and a11y snapshots will be saved

