#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies for Responsive_Onboarding_UI_v2..."
if command -v npm >/dev/null 2>&1; then
  npm ci
else
  echo "npm not found. Please install Node.js and npm."
  exit 1
fi

# Install Playwright browsers
npx playwright install

echo "Setup complete." 
