# Responsive Onboarding UI v2 — Fix Summary

This small Vite + React TypeScript app reproduces and fixes onboarding UI/UX regressions: overlapping header on mid-size viewports, CTA hidden by sticky footer on mobile Safari, and Markdown rendering raw HTML in dark mode.

Key fixes implemented:
- Responsive breakpoints with adjusted content max-width and header/body spacing to avoid overlap at 13" laptop breakpoints (min-width 1024px max 1440px).
- Anchor CTA with fixed positioning and bottom offset using a CSS variable for footer height and env(safe-area-inset-bottom) to keep CTA visible above sticky footer on mobile Safari.
- Markdown rendering via `react-markdown` + `rehype-sanitize` to prevent raw HTML or script tags from rendering in dark mode.
- Accessibility improvements (ARIA roles, focus control, keyboard navigation, visible focus outlines).

How to run tests:
- Install dependencies: `npm ci` (or run `scripts/setup.sh` / `scripts/setup.ps1`)
- Start dev server: `npm run dev`
- In another shell, run tests: `npm run test:ui` or `sh scripts/run_ui_suite.sh`

Test outputs are saved to `docs/screenshots` and `docs/ui_test_results.json`.
