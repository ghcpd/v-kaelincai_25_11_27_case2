# Responsive_Onboarding_UI_v2 — Diagnosis & Plan

## Overview
- App: Onboarding Wizard (React + TypeScript)
- Issues:
  - Overlapping header on mid-size (13" laptop) viewports
  - Primary CTA hidden/covered on mobile Safari due to sticky footer
  - Markdown handbook displays raw HTML in dark mode and unsanitized content

## Flow mapping (load → render → interact → submit)
1. Load: index.html loads app; main loads mock API data for profile & handbook
2. Render: Header is sticky; main content uses CSS grid columns (sidebar + panel); footer is sticky at bottom
3. Interact: Buttons in nav and footer change steps; keyboard events allow Arrow navigation
4. Submit: The last step "Submit" triggers event and logs

## Root-cause summary
- Header overlap: CSS used position: sticky with top 0 but main's content lacked consistent top padding on mid-size breakpoints causing content to be positioned under sticky header on 13" widths. Lack of explicit --header-height boundary across breakpoints.
- Mobile CTA hidden: Sticky footer covering interactive CTAs; on mobile Safari, viewport units and safe area insets differ; lack of anchor + bottom padding causes CTA to be unreachable/covered.
- Markdown raw HTML: ReactMarkdown without rehype-sanitize coupled with CSS color-scheme differences allowed HTML tags to be interpreted as fallback content in dark mode.

## Evidence collected (by tests)
- DOM snapshots: saved at `docs/screenshots/*.dom.html`
- CSS & computed layout: Playwright collects boundingBoxes and grid templates
- Accessibility: Playwright accessibility snapshot saved (`*.a11y.json`)
- Structured logs: captured JSON events emitted from app to console and written to logs during tests

## Fixes implemented
- CSS variables (`--header-height`/`--footer-height`) set, with breakpoints ensuring consistent top padding on `main`
- Footer uses sticky with safe-area-inset-bottom, added `cta-anchored` to keep the primary CTA visible above footer on mobile Safari
- Markdown: `react-markdown` with `rehype-sanitize` to strip unsafe tags like `<script>` and prevent raw HTML rendering. Also, improved dark-mode CSS definitions to ensure typography uses readable contrasts
- Accessibility: keyboard Arrow navigation, structured aria attributes, `aria-live` for step changes, focus management, and the `data-session-id` attribute to associate logs and UI actions

## How to run tests
1. Install dependencies: `npm ci` and `npx playwright install`
2. Start dev server and run UI suite: `./scripts/run_ui_suite.sh` (Linux/Mac) or `./run_tests.sh` (Windows PowerShell supports run_tests.ps1)

