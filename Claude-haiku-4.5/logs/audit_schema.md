# UI Event Schema - Audit Log Definition
# Path: logs/ui_event_schema.json
# This file documents the structure for PII-redacted UI interaction logging
# Used for capturing UI/UX metrics and accessibility validation

The UI event schema provides:
- Session tracking with unique ID (UUID) and no PII
- Request-level granularity with hex-based request IDs
- Event categorization (page_load, navigation, button_click, keyboard_navigation, etc.)
- Component and element targeting (componentName, elementId, elementClass)
- Action context (step, direction, theme, keyCode, focusedElement)
- Performance/accessibility metrics (renderTime, CLS, a11y violations, CTA visibility)
- Status tracking (success/warning/error)

Key features:
✓ No PII in logs (names, emails redacted)
✓ Session/Request IDs for correlation
✓ Viewport and device type tracking
✓ Markdown rendering performance (ms)
✓ Theme tracking (light/dark)
✓ Accessibility scoring (0-100)
✓ Layout stability (CLS) monitoring
✓ CTA visibility tracking
✓ Focus and keyboard navigation logging

Example usage:
1. Create new UILogger() instance on page load
2. Call logEvent() for each user interaction
3. Export session data: uiLogger.exportAsJSON()
4. POST to backend for analysis

See logs/ui_event_schema.json for full JSON schema and examples.
