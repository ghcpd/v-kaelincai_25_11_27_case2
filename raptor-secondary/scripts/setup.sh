#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
