#!/usr/bin/env bash
set -e
# Start the vite server, run tests, then stop
npm run dev &
VITE_PID=$!
# Wait for server to start
sleep 2
node tests/run_suite.js
kill $VITE_PID || true

echo 'UI suite complete. screenshots available in docs/screenshots'
