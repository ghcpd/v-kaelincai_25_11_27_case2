# Root-Cause Analysis & Fixes (Summary)

## Issues observed
- Header overlaps form on mid-size viewports (e.g. 13" laptop width ~1280px)
- Submit CTA hidden/covered by sticky footer in mobile Safari
- Markdown handbook displays raw HTML in dark mode (script tags rendered)

## Root causes
- CSS positioning: header is `position: sticky` and content had no top padding/margin, letting header overlay the content at smaller viewports; fix by adding content padding-top equal to header height.
- Sticky footer overlay: fixed or sticky footer overlays bottom content because content lacked bottom padding; solution is adding content padding-bottom to account for footer and anchor CTAs above footer using CSS variables + safe-area-inset.
- Markdown render allowed raw HTML; using `react-markdown` without sanitize allowed raw HTML in output; fix using `rehype-sanitize` plugin and CSS dark-mode styles.

## Evidence gathered
- DOM/CSS snapshots: `docs/screenshots/*.png` (header overlap, CTA visibility), page source (Playwright screenshot captures fullPage), and logs in `docs/ui_test_results.json`.
- Viewport-specific traces: tests run with viewports 1440x900, 1280x800, 375x812 to reproduce reported breakpoints.
- Accessibility scans: Basic checks for `role=main`, `aria-roledescription`, and keyboard navigation steps are in `tests/run_suite.js`.

## Fixes implemented
- `.content { padding-top: calc(var(--header-height) + 1rem) }` and `.content { padding-bottom: calc(var(--footer-height) + env(safe-area-inset-bottom)); }`
- Anchor `.anchor-cta { position: fixed; bottom: calc(var(--footer-height) + env(safe-area-inset-bottom) + 8px) }` to ensure CTA visible and clickable above sticky footer.
- Use `react-markdown` + `rehype-sanitize` to sanitize HTML in Markdown and match dark-mode styles.
- Add keyboard nav with `onKeyDown` handler, focus management, and aria roles.

