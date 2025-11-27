Write-Output "Installing dependencies for Responsive_Onboarding_UI_v2..."
if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm ci
} else {
  Write-Output "npm not found. Please install Node.js and npm."
  Exit 1
}

npx playwright install
Write-Output "Setup complete."