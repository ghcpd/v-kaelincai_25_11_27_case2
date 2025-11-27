if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error 'Please install Node.js (LTS) and rerun'; exit 1 }
npm ci
npx playwright install
Write-Output 'Setup complete. Run `npm run dev` to start the frontend, `npm run test:ui` to run Playwright suite.'
