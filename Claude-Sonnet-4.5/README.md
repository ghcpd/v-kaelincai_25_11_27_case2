# Responsive Onboarding UI v2

Employee Onboarding Portal with responsive UI fixes and accessibility improvements.

## 🎯 Project Overview

This project addresses critical UI/UX regressions in the onboarding wizard:
- **Layout overlap** on 13" laptops between header and content
- **Hidden CTAs** on mobile Safari due to sticky footer issues  
- **Raw HTML rendering** in dark mode Markdown content
- **Accessibility gaps** in keyboard navigation and ARIA labels

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for responsive styling
- **react-markdown** + DOMPurify for safe Markdown rendering
- **Playwright** for UI testing

### Key Fixes Implemented

#### 1. Responsive Layout (13" Laptop Breakpoint)
- Custom Tailwind breakpoint: `laptop-13: '1280px'`
- Flex-based layouts prevent overlap
- Proper spacing with `pb-24 sm:pb-28` to accommodate sticky footer

#### 2. Mobile Safari CTA Visibility
- Sticky footer with `env(safe-area-inset-bottom)` support
- Full-width CTAs on mobile with proper stacking
- Tested on iPhone 12 viewport (390x844)

#### 3. Dark Mode Markdown Rendering
- Theme-aware component with `.markdown-content.dark` class
- DOMPurify sanitization prevents XSS
- CSS variables for light/dark theming
- Proper styling for HTML elements within Markdown

#### 4. Accessibility Improvements
- Skip-to-content link
- ARIA labels and landmarks
- Focus management between steps
- Keyboard navigation support (Tab, Enter, Space)
- Visible focus indicators

## 📁 Project Structure

```
c:\chatWorkSpace\
├── frontend/                   # React application
│   ├── components/
│   │   ├── OnboardingWizard.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── steps/
│   │       ├── PersonalInfoStep.tsx
│   │       ├── DepartmentStep.tsx
│   │       ├── HandbookStep.tsx
│   │       └── CompleteStep.tsx
│   ├── services/
│   │   └── mockApi.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── mocks/
│   └── mock_api.json           # Mock profile and handbook data
├── logs/
│   └── ui_event_schema.json    # Structured logging schema
├── tests/
│   ├── ui/
│   │   ├── ui_cases.yaml       # Test scenario definitions
│   │   └── onboarding.spec.ts  # Playwright tests
│   └── run_suite.js            # Test runner
├── scripts/
│   └── run_ui_suite.sh         # UI test execution script
├── docs/
│   └── screenshots/            # Test screenshots (generated)
├── package.json
├── vite.config.ts
├── playwright.config.ts
├── tailwind.config.js
├── setup.sh                    # Environment setup
└── run_tests.sh               # Test wrapper
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Setup

On Windows (PowerShell):
```powershell
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Build the project
npm run build
```

On Linux/Mac:
```bash
# Run setup script
bash setup.sh
```

### Development

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all UI tests with screenshots
npm test

# Run Playwright tests with UI
npm run test:headed

# Debug tests
npm run test:debug

# Using shell script (Linux/Mac)
bash run_tests.sh
```

## 🧪 UI Test Scenarios

### 1. Desktop Layout (1920x1080)
- Verifies no header/content overlap
- Checks step indicator visibility
- Validates CTA accessibility

### 2. 13-inch Laptop (1280x800)
- Tests responsive breakpoint behavior
- Ensures proper element spacing
- Validates layout adaptation

### 3. Mobile Safari (390x844)
- Confirms CTA visibility with sticky footer
- Tests safe-area-inset handling
- Validates touch target sizes

### 4. Dark Mode Markdown
- Verifies Markdown rendering in dark theme
- Checks HTML sanitization
- Validates theme-aware styling
- Tests highlight boxes and custom HTML

### 5. Keyboard Navigation
- Tests Tab order through all elements
- Validates Enter/Space activation
- Checks skip-link functionality
- Verifies ARIA labels and focus indicators

## 📊 Structured Logging

All UI interactions are logged with:
- Unique `sessionId` (persists across actions)
- Unique `requestId` (per event)
- ISO 8601 timestamps
- Viewport metadata (width, height, device type)
- Theme information
- PII redaction

Schema: `logs/ui_event_schema.json`

Example log:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "requestId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "timestamp": "2025-11-27T10:30:45.123Z",
  "eventType": "user_interaction",
  "component": "OnboardingWizard",
  "action": "step_navigation",
  "metadata": {
    "viewport": {"width": 1280, "height": 800, "deviceType": "laptop"},
    "stepId": 2,
    "theme": "light"
  }
}
```

## 📸 Screenshots

After running tests, screenshots are saved to `docs/screenshots/`:
- `desktop-layout.png` - Desktop viewport rendering
- `laptop-13-layout.png` - 13" laptop responsive layout
- `mobile-safari-cta-visible.png` - Mobile CTA visibility
- `mobile-safari-submit-visible.png` - Submit button on mobile
- `dark-mode-markdown.png` - Dark mode Markdown rendering
- `keyboard-navigation.png` - Keyboard focus states

## 🔍 Root Cause Analysis

### Layout Overlap Issue
**Cause**: Missing responsive breakpoints and fixed header without proper z-index/spacing management.

**Fix**: 
- Added `laptop-13` breakpoint (1280px)
- Proper padding-bottom on content (`pb-24 sm:pb-28`)
- Sticky positioning with z-index hierarchy

### Hidden CTA Issue  
**Cause**: Sticky footer not accounting for mobile Safari safe areas, covering primary buttons.

**Fix**:
- CSS `env(safe-area-inset-bottom)` for safe area handling
- Full-width mobile CTAs with proper stacking
- Explicit `toBeInViewport()` tests

### Markdown Raw HTML Issue
**Cause**: Markdown renderer not applying theme classes to HTML elements, lacking sanitization.

**Fix**:
- DOMPurify sanitization layer
- Theme-aware CSS with `.markdown-content.dark` selector
- Custom component styling for HTML elements

## 🛠️ Technical Constraints

- **Language**: TypeScript (React 18)
- **No External Services**: Local mock API only
- **Sanitization**: DOMPurify for HTML content
- **Testing**: Playwright with viewport emulation
- **Browser Support**: Modern browsers + mobile Safari

## 📋 Test Results Format

```
✅ All UI tests passed successfully!

📊 Test Summary:
   ✓ Desktop Layout - No Overlap
   ✓ 13-inch Laptop Breakpoint
   ✓ Mobile Safari CTA Visibility
   ✓ Dark Mode Markdown Rendering
   ✓ Keyboard Navigation

📸 Screenshots: docs/screenshots/
📄 Full HTML Report: playwright-report/index.html
```

## 🤝 Contributing

This project follows the UI fix workflow:
1. Identify regression with test case
2. Implement responsive fix with proper breakpoints
3. Add accessibility improvements
4. Create Playwright test scenario
5. Capture before/after screenshots
6. Document root cause and fix

## 📄 License

MIT
