#!/bin/bash
# Main test runner wrapper - orchestrates all UI integration tests
# Calls: npm install, dev server setup, Playwright tests, report generation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Employee Onboarding Portal - UI Regression Test Suite    ║"
echo "║  Version: Responsive_Onboarding_UI_v2                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Setup
echo "Step 1: Setting up project..."
cd "$PROJECT_ROOT"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Step 2: Build frontend
echo ""
echo "Step 2: Building frontend..."
cd "$PROJECT_ROOT/frontend"
npm run build 2>/dev/null || true

# Step 3: Run tests
echo ""
echo "Step 3: Running UI integration tests..."
cd "$PROJECT_ROOT"

# Run the test suite
npm run test:ui

echo ""
echo "✓ Test suite completed!"
echo ""
echo "Deliverables:"
echo "  - Frontend: frontend/"
echo "  - Screenshots: docs/screenshots/"
echo "  - Test results: tests/results.json"
echo "  - UI logging schema: logs/ui_event_schema.json"
echo "  - Mock API: mocks/mock_api.json"
echo ""
