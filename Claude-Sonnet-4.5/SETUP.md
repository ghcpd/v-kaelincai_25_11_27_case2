# Setup Guide

This guide walks you through setting up the Responsive Onboarding UI v2 project on your local machine.

## Prerequisites

### Required
- **Node.js**: Version 18 or later ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (version 9 or later recommended)
- **Git**: For cloning the repository

### Optional
- **Visual Studio Code**: Recommended IDE
- **PowerShell**: For Windows users (comes with Windows)
- **Bash**: For Linux/Mac users

## Installation Steps

### Step 1: Install Dependencies (Windows - PowerShell)

```powershell
# Navigate to project directory
cd c:\chatWorkSpace

# Install Node.js packages
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Build the project
npm run build
```

### Step 1: Install Dependencies (Linux/Mac - Bash)

```bash
# Navigate to project directory
cd /path/to/chatWorkSpace

# Run automated setup
bash setup.sh
```

The `setup.sh` script will:
- Check for Node.js and npm
- Install all dependencies
- Install Playwright browsers
- Create necessary directories
- Build the project

### Step 2: Verify Installation

```bash
# Check Node version
node -v
# Expected: v18.x.x or later

# Check npm version
npm -v
# Expected: 9.x.x or later

# Verify Playwright installation
npx playwright --version
# Expected: Version 1.40.x or later
```

### Step 3: Start Development Server

```bash
npm run dev
```

This will:
- Start Vite development server on `http://localhost:3000`
- Open browser automatically
- Enable hot module replacement (HMR)

You should see:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Run Tests

```bash
# Run all UI tests
npm test

# Or run Playwright directly
npx playwright test

# Run with headed browser (see tests running)
npm run test:headed

# Debug tests
npm run test:debug
```

## Project Structure Overview

```
c:\chatWorkSpace\
├── frontend/              # React application source
│   ├── components/       # UI components
│   ├── services/         # Mock API
│   └── utils/           # Logging utilities
├── mocks/                # Mock data
├── logs/                 # Logging schemas
├── tests/                # Playwright tests
│   └── ui/              # UI test scenarios
├── scripts/              # Shell scripts
├── docs/                 # Documentation
│   └── screenshots/     # Test screenshots (generated)
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── playwright.config.ts  # Test configuration
└── tailwind.config.js    # Tailwind CSS config
```

## Troubleshooting

### Issue: "Cannot find module 'react'"

**Solution**: Dependencies not installed properly
```bash
rm -rf node_modules
npm install
```

### Issue: Playwright browsers not found

**Solution**: Install browsers
```bash
npx playwright install --with-deps chromium
```

### Issue: Port 3000 already in use

**Solution**: Change port in `vite.config.ts`
```typescript
server: {
  port: 3001,  // Change to available port
}
```

Or kill existing process:
```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Issue: Tests failing on Windows

**Solution**: Use PowerShell or Git Bash, not CMD
```powershell
# In PowerShell
npm test
```

### Issue: Permission denied on .sh scripts

**Solution**: Make scripts executable (Linux/Mac)
```bash
chmod +x setup.sh run_tests.sh scripts/run_ui_suite.sh
```

## Environment Configuration

### Development
No `.env` file needed - all configuration is in code.

### Production Build
```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## IDE Setup (Optional)

### Visual Studio Code Extensions

Recommended extensions:
1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **Playwright Test for VSCode** - Test debugging

Install all at once:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-playwright.playwright
```

### VSCode Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*[:=]\\s*['\"`]([^'\"`]*)['\"`]", "([^\\s]+)"]
  ]
}
```

## Next Steps

1. ✅ Start development server: `npm run dev`
2. ✅ Open http://localhost:3000 in browser
3. ✅ Run tests: `npm test`
4. ✅ Review screenshots in `docs/screenshots/`
5. ✅ Read `docs/root-cause-analysis.md` for technical details
6. ✅ Check `docs/test-scenarios.md` for test documentation

## Getting Help

- 📖 **Documentation**: See `README.md` and `docs/` folder
- 🐛 **Issues**: Check console logs and error messages
- 📝 **Tests**: Review Playwright report at `playwright-report/index.html`
- 💬 **Support**: Contact project maintainers

---

**Installation time**: ~5-10 minutes (including browser downloads)

Last updated: 2025-11-27
