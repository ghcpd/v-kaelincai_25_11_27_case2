#!/usr/bin/env bash
set -euo pipefail

# start the dev server in background, run Playwright tests, then stop
PORT=5173
npm run dev &
DEV_PID=$!

# wait for server
until curl -sS "http://localhost:$PORT" >/dev/null; do
  sleep 0.5
done

npx playwright test --config=playwright.config.ts --reporter=list
RESULT=$?
kill $DEV_PID
exit $RESULT
