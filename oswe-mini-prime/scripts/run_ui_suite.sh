#!/usr/bin/env bash
# Starts mock API and runs Playwright test suite capturing screenshots
set -e
cd "$(dirname "$0")/.."

# start mock API in background
node mocks/server.js &
MOCK_PID=$!

# start dev server if not running
npx vite &
VITE_PID=$!

# Wait a small few seconds to ensure both servers are up
sleep 2

npx playwright test || EXIT_CODE=$?

# kill background processes
kill $MOCK_PID || true
kill $VITE_PID || true

exit ${EXIT_CODE:-0}
