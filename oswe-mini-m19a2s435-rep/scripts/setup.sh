#!/usr/bin/env bash
# Bootstrap instructions for *nix
set -e
if ! command -v node >/dev/null 2>&1; then
  echo 'Please install Node.js (LTS)'
  exit 1
fi
npm ci
npx playwright install

echo 'Setup complete. Run `npm run dev` to start the frontend, `npm run test:ui` to run Playwright suite.'
