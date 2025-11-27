#!/usr/bin/env bash
# Setup script: installs dependencies
set -e
which node >/dev/null || { echo "Node.js not installed. Please install Node LTS."; exit 1; }
cd "$(dirname "$0")"
npm ci
npx playwright install --with-deps
