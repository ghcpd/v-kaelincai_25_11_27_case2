# PowerShell script to start mock server and run Playwright tests
$ErrorActionPreference = 'Stop'
$base = Resolve-Path -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)\.."
Push-Location $base

Start-Process -NoNewWindow -FilePath "node" -ArgumentList "mocks/server.js"
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "vite"
Start-Sleep -Seconds 2

& npx playwright test

Pop-Location
