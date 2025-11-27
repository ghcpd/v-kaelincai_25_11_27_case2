#!/bin/bash
# Setup script - Bootstrap development environment
# Installs Node.js dependencies and configures frontend build

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      Employee Onboarding Portal - Setup                    ║"
echo "║      Responsive_Onboarding_UI_v2                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js 16+ first."
  exit 1
fi

echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm ci

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm run dev              - Start development server"
echo "  2. npm run test:ui          - Run UI tests"
echo "  3. npm run build            - Build for production"
echo ""
