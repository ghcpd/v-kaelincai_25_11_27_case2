# PowerShell setup: installs dependencies
Set-StrictMode -Version Latest
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error "Node.js not installed. Please install Node LTS."; exit 1 }
cd (Split-Path -Parent $MyInvocation.MyCommand.Definition)
npm ci
npx playwright install --with-deps
