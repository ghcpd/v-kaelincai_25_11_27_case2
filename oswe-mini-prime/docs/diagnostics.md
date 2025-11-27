# Diagnostics & Root Cause Evidence

This file summarizes tests and traces produced by the Playwright test harness and explains the root cause and fixes.

1) Header overlap
- Evidence: `docs/screenshots/layout_trace_desktop.json` and `docs/screenshots/layout_trace_laptop13.json` show `headerRect.bottom` and `contentRect.top` values.
- Root cause: header was position: sticky; without adequate content top padding causing overlapping at some breakpoints.
- Fix: `content` was given padding-top equal to header height plus margin; media queries adjust header size at small viewports.

2) CTA hidden on mobile Safari
- Evidence: `docs/screenshots/layout_trace_mobile_safari.json` shows computed styles and the presence of `env(safe-area-inset-bottom)` padding.
- Root cause: fixed/sticky footer shows atop the viewport on Safari when the bottom safe area inset is not accounted for.
- Fix: added `env(safe-area-inset-bottom)` padding and sticky CTA anchored above the footer; the CTA is now visible.

3) Markdown misrendering (raw HTML in dark mode)
- Evidence: `docs/screenshots/dark_mode_markdown.png` / `layout_trace_dark_mode_markdown.json` and test check that HTML isn't raw in DOM.
- Root cause: Markdown rendering without sanitization or the markup being rendered as textual HTML in some themes.
- Fix: `react-markdown` with `rehype-raw` + `rehype-sanitize` to allow safe HTML while preventing raw unsafe HTML from being rendered.

4) Accessibility & keyboard navigation
- Evidence: `docs/screenshots/a11y_snapshot_<scenario>.json` includes accessibility tree snapshots.
- Fix: ARIA regions, labelled headings, focussable controls, keyboard support and ensure actions are reachable.


# How to Re-run
- Use the `scripts/run_ui_suite.sh` script to run mock API + dev server + Playwright tests.
- Screenshots and traces will be stored under `docs/screenshots`.

Notes: For real CI and production, integrate the mock API into a test harness that is fully deterministic and ensure Playwright collects trace logs for all runs.
