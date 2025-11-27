#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

# Run Playwright UI suite and capture screenshots
npx playwright test --config=playwright.config.ts "$@"
