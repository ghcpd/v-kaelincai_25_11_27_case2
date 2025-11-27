#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Ensure dependencies installed
npm ci
npx playwright install

# Run the UI suite
scripts/run_ui_suite.sh
