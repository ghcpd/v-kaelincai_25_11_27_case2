# Employee Onboarding Portal — Responsive_Onboarding_UI_v2

This front-end demo implements a responsive onboarding wizard in React + TypeScript, with fixes for overlapping header/content at mid-size viewports, a sticky footer that doesn't hide CTAs (mobile Safari safe-area support), Markdown rendering that sanitizes HTML, and accessibility improvements.

## Setup

1. Install dependencies (Requires Node 16+):

```bash
cd frontend
npm ci
npx playwright install --with-deps
```

2. Run mock API (separate terminal):

```bash
npm run start:mock
```

3. Launch dev site:

```bash
npm run dev
```

4. Run the Playwright UI test suite and capture screenshots (single command):

```bash
./scripts/run_ui_suite.sh
# or
npm run test:ui:run
```

## What's included
- `src/` — React components (OnboardingWizard, steps, logger)
- `mocks/` — local JSON and express mock server
- `tests/ui/` — Playwright UI tests and a YAML list of scenarios
- `scripts/run_ui_suite.sh` — starts the mock server and runs Playwright tests
- `docs/screenshots/` — placeholder or captured screenshots
- `logs/ui_event_schema.json` — event log schema

## UI Fixes & Implementation notes
1. Header Overlap
   - The header is position: sticky; top: 0 with z-index and the `.content` area has padding-top equal to the header height to prevent overlap.
   - Breakpoint at 1280px adjusts layout for 13\" laptops.

2. Sticky Footer / CTA on Mobile Safari
   - The footer uses `position: sticky; bottom: 0` and content uses `padding-bottom: env(safe-area-inset-bottom)` to keep floating CTAs above the bottom safe area on iOS Safari.
   - CTA appears in the interior `card` as an extra anchor so it remains visible and clickable.

3. Markdown Rendering
   - `react-markdown` with `rehype-raw` + `rehype-sanitize` to support safe HTML snippets, sanitized per `rehype-sanitize` rules.
   - Dark and light modes use CSS variables for consistent theming across steps.

4. Accessibility
   - ARIA attributes and role=region for steps.
   - Keyboard navigation supports tabbing and Enter activation for primary actions.

## Playwright scenarios covered
1. Desktop layout – header not overlapping content, CTA is visible.
2. 13" laptop breakpoint – header not overlapping content.
3. Mobile Safari (WebKit) – CTA visible & clickable for critical actions.
4. Dark mode — Markdown content is sanitized and styled.
5. Keyboard navigation – steps navigable and actions invocable with keyboard only.

## Logs
- UI events are emitted via `console.info` in the browser and contain a `sessionId`, `event`, `payload`, and timestamp per `logs/ui_event_schema.json`.
- Email addresses are masked in logs.

## Notes
- This is a local demo; in production, you would replace the mock server and provide server-side sanitization.
- Playwright's `--project=WebKit` is used to emulate Safari behavior.

