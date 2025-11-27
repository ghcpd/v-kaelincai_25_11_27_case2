$PORT=5173
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run","dev" -PassThru | Out-Null
Start-Sleep -Seconds 2

$uri = "http://localhost:$PORT"
while (-not (Invoke-WebRequest $uri -UseBasicParsing -ErrorAction SilentlyContinue)) {
  Start-Sleep -Milliseconds 500
}

npx playwright test --config=playwright.config.ts --reporter=list
$LASTEXITCODE
