# Screenshots Directory

This directory contains UI test screenshots captured during Playwright test execution.

## Generated Screenshots

After running `npm test` or `bash run_tests.sh`, the following screenshots will be generated:

### 1. desktop-layout.png
- **Viewport**: 1920x1080 (Desktop)
- **Purpose**: Verify no header/content overlap on large screens
- **Captures**: Full page with step indicator, content area, and CTAs visible

### 2. laptop-13-layout.png
- **Viewport**: 1280x800 (13-inch Laptop)
- **Purpose**: Test responsive breakpoint behavior
- **Captures**: Layout adaptation at critical laptop viewport size

### 3. mobile-safari-cta-visible.png
- **Viewport**: 390x844 (iPhone 12)
- **Purpose**: Confirm Next button visibility with sticky footer
- **Captures**: Mobile view with CTA in viewport (not covered)

### 4. mobile-safari-submit-visible.png
- **Viewport**: 390x844 (iPhone 12)
- **Purpose**: Confirm Submit button accessibility on final step
- **Captures**: Step 4 with Submit button visible and clickable

### 5. dark-mode-markdown.png
- **Viewport**: 1280x800 (Laptop)
- **Purpose**: Verify Markdown rendering in dark theme
- **Captures**: Handbook step (step 3) with styled Markdown content in dark mode

### 6. keyboard-navigation.png
- **Viewport**: 1920x1080 (Desktop)
- **Purpose**: Show focus indicators during keyboard navigation
- **Captures**: Focus state on interactive elements

## Viewing Screenshots

Screenshots are PNG files that can be opened in any image viewer or browser.

### Quick Preview (PowerShell)
```powershell
# Open screenshots directory
ii docs\screenshots\

# View specific screenshot
start docs\screenshots\desktop-layout.png
```

### Quick Preview (Bash)
```bash
# Open screenshots directory
open docs/screenshots/  # macOS
xdg-open docs/screenshots/  # Linux

# View specific screenshot
open docs/screenshots/desktop-layout.png
```

## Screenshot Usage

These screenshots serve as:
1. **Visual regression evidence** - Compare before/after fixes
2. **Documentation artifacts** - Show UI states in different scenarios
3. **QA validation** - Manual review of automated test results
4. **Stakeholder communication** - Visual proof of bug fixes

## Redaction

All screenshots are automatically redacted to exclude PII:
- Mock data used (no real user information)
- Generic profile: Jane Doe, john.smith@company.com
- Test department and manager names
- No sensitive company data displayed

## Regenerating Screenshots

To regenerate all screenshots:

```bash
# Clean old screenshots
rm docs/screenshots/*.png

# Run tests (generates new screenshots)
npm test
```

Individual test runs will overwrite existing screenshots with matching filenames.

## CI/CD Artifacts

In CI/CD pipelines, these screenshots are uploaded as build artifacts for review:

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: ui-test-screenshots
    path: docs/screenshots/
    retention-days: 30
```

## Troubleshooting

### Screenshots Not Generated
- Ensure Playwright browsers are installed: `npx playwright install`
- Check test execution logs for errors
- Verify `docs/screenshots/` directory exists

### Screenshots Look Wrong
- Clear browser cache: `npx playwright test --clear-cache`
- Regenerate baseline: `npm test`
- Check viewport settings in `playwright.config.ts`

---

Last updated: 2025-11-27
