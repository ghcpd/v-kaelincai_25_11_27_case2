# Test Scenarios Documentation

## Overview
This document details the 5 UI integration test scenarios for the Responsive Onboarding UI v2 project. Each scenario targets a specific regression or requirement.

---

## Scenario 1: Desktop Layout - No Overlap

### Objective
Verify that the onboarding wizard renders correctly on desktop viewports without header/content overlap.

### Viewport
- **Width**: 1920px
- **Height**: 1080px
- **Device Type**: Desktop

### Test Steps
1. Navigate to `/`
2. Wait for `[role="region"][aria-label="Onboarding wizard"]` to load
3. Take screenshot: `desktop-layout.png`
4. Measure bounding boxes of header and main content
5. Verify header.bottom ≤ content.top (no overlap)
6. Verify Next button is visible and enabled

### Expected Outcomes
- ✅ Header and step indicator are visible
- ✅ Content area has proper spacing (no overlap)
- ✅ Navigation buttons clearly visible
- ✅ All elements render within viewport

### Validation Method
```typescript
const headerBox = await header.boundingBox();
const contentBox = await mainContent.boundingBox();
expect(headerBox.y + headerBox.height).toBeLessThanOrEqual(contentBox.y);
```

### Success Criteria
- No visual overlaps
- All interactive elements accessible
- Screenshot matches expected layout

---

## Scenario 2: 13-inch Laptop Breakpoint

### Objective
Test that layout adapts properly on 13-inch laptop viewport with responsive breakpoints applied and no overlapping panels.

### Viewport
- **Width**: 1280px
- **Height**: 800px
- **Device Type**: Laptop (13-inch)

### Test Steps
1. Navigate to `/` with 1280x800 viewport
2. Wait for wizard to load
3. Take screenshot: `laptop-13-layout.png`
4. Verify responsive breakpoint classes applied
5. Check step indicator adapts to available space
6. Verify sticky footer doesn't cover content
7. Confirm Next button is in viewport

### Expected Outcomes
- ✅ Responsive breakpoints (`laptop-13`) applied
- ✅ No header/content overlap
- ✅ Step indicator adapts (may stack on smaller viewports)
- ✅ All content readable and accessible
- ✅ Padding compensates for sticky footer

### Validation Method
```typescript
test.use({ viewport: { width: 1280, height: 800 } });
await expect(nextButton).toBeInViewport();
```

### Success Criteria
- Layout transitions smoothly at 1280px breakpoint
- No element clipping or overflow
- Touch targets meet minimum size (44x44px)

---

## Scenario 3: Mobile Safari - Visible CTA

### Objective
Ensure Submit button and primary CTAs are visible and not hidden by sticky footer on mobile Safari, accounting for safe-area-inset.

### Viewport
- **Width**: 390px
- **Height**: 844px
- **Device Type**: Mobile (iPhone 12)

### Test Steps
1. Navigate to `/` with iPhone 12 viewport
2. Scroll to bottom of page
3. Verify Next button is visible and in viewport
4. Take screenshot: `mobile-safari-cta-visible.png`
5. Navigate through steps to final submit page (step 4)
6. Scroll to verify Submit button visibility
7. Take screenshot: `mobile-safari-submit-visible.png`
8. Verify safe-area-inset padding applied

### Expected Outcomes
- ✅ Next button visible and clickable throughout journey
- ✅ Submit button not covered by sticky footer
- ✅ `env(safe-area-inset-bottom)` padding applied
- ✅ CTAs remain accessible with keyboard/touch
- ✅ Full-width mobile buttons with proper spacing

### Validation Method
```typescript
await expect(nextButton).toBeVisible();
await expect(nextButton).toBeInViewport();
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await expect(submitButton).toBeInViewport();
```

### Success Criteria
- CTAs never obscured by footer
- Touch targets ≥44px height
- Safe area respected on notched devices
- No horizontal scrolling

---

## Scenario 4: Dark Mode Markdown Rendering

### Objective
Verify Markdown content renders properly in dark mode without raw HTML display, with proper sanitization and theme-aware styling.

### Viewport
- **Width**: 1280px
- **Height**: 800px
- **Device Type**: Laptop

### Test Steps
1. Navigate to `/`
2. Toggle theme to dark mode
3. Verify `dark` class applied to `<html>`
4. Navigate to step 3 (Handbook)
5. Wait for `.markdown-content.dark` to load
6. Take screenshot: `dark-mode-markdown.png`
7. Verify no raw HTML tags in text content
8. Verify theme-aware styles applied
9. Check highlight-box elements render correctly

### Expected Outcomes
- ✅ Markdown renders with proper dark mode styles
- ✅ No raw HTML tags visible (e.g., `<div>`, `<strong>`)
- ✅ HTML content properly sanitized (XSS prevention)
- ✅ Theme-aware colors applied correctly
- ✅ highlight-box divs styled for dark mode
- ✅ Text contrast meets WCAG AA standards

### Validation Method
```typescript
const textContent = await markdownContent.textContent();
expect(textContent).not.toContain('<div');
expect(textContent).not.toContain('</div>');

await expect(markdownDiv).toHaveAttribute('data-theme', 'dark');
```

### Success Criteria
- All Markdown elements styled consistently
- HTML elements within Markdown render (not shown as text)
- DOMPurify sanitization prevents XSS
- Color contrast ratio ≥4.5:1 for text

---

## Scenario 5: Keyboard Navigation

### Objective
Test accessibility with keyboard-only navigation through all wizard steps, verifying ARIA labels, focus management, and skip links.

### Viewport
- **Width**: 1920px
- **Height**: 1080px
- **Device Type**: Desktop

### Test Steps
1. Navigate to `/`
2. Press Tab → verify skip link receives focus
3. Press Tab → verify theme toggle receives focus
4. Tab through page to Next button
5. Press Enter on Next button → verify step advances
6. Take screenshot: `keyboard-navigation.png`
7. Navigate to step 3 (Handbook)
8. Tab to handbook acknowledge checkbox
9. Press Space → verify checkbox checks
10. Verify all ARIA labels present

### Expected Outcomes
- ✅ All interactive elements reachable via Tab
- ✅ Focus indicators clearly visible (2px outline)
- ✅ Enter/Space activate buttons and checkboxes
- ✅ Skip link available and functional
- ✅ ARIA labels present for screen readers
- ✅ Focus order follows logical flow (top→bottom, left→right)
- ✅ No keyboard traps

### Validation Method
```typescript
await page.keyboard.press('Tab');
await expect(skipLink).toBeFocused();

await page.keyboard.press('Enter');
await expect(stepIndicator).toContainText('Step 2');

await page.keyboard.press('Space');
await expect(checkbox).toBeChecked();
```

### Success Criteria
- Tab order matches visual layout
- All controls operable via keyboard
- Focus never lost or trapped
- Screen reader announces state changes
- Meets WCAG 2.1 Level AA

---

## Test Execution

### Command
```bash
npm test
# or
bash run_tests.sh
# or
npx playwright test
```

### Output Format
```
🧪 Running UI Test Scenarios...

✓ Desktop Layout - No Overlap (2.3s)
✓ 13-inch Laptop Breakpoint (1.8s)  
✓ Mobile Safari - Visible CTA (3.1s)
✓ Dark Mode Markdown Rendering (2.5s)
✓ Keyboard Navigation (4.2s)

📊 Test Summary:
   5 passed (13.9s)

📸 Screenshots: docs/screenshots/
```

### Artifacts
- Screenshots: `docs/screenshots/*.png`
- HTML Report: `playwright-report/index.html`
- Video recordings: `test-results/**/video.webm` (on failure)
- Trace files: `test-results/**/trace.zip` (on retry)

---

## Maintenance

### Adding New Scenarios
1. Add to `tests/ui/ui_cases.yaml`
2. Implement in `tests/ui/onboarding.spec.ts`
3. Update this documentation
4. Add expected screenshot to docs

### Debugging Failed Tests
```bash
# Run with headed browser
npm run test:headed

# Debug specific test
npm run test:debug -- --grep "Mobile Safari"

# Generate trace
npx playwright test --trace on
```

### CI/CD Integration
```yaml
# .github/workflows/ui-tests.yml
- name: Run UI Tests
  run: npm test
  
- name: Upload Screenshots
  uses: actions/upload-artifact@v3
  with:
    name: screenshots
    path: docs/screenshots/
```

---

## References

- Test definitions: `tests/ui/ui_cases.yaml`
- Playwright specs: `tests/ui/onboarding.spec.ts`
- Test runner: `tests/run_suite.js`
- Shell script: `scripts/run_ui_suite.sh`
