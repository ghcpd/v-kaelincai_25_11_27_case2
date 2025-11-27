#!/bin/bash
# Playwright UI test harness with screenshot capture
# Runs all 5 responsive onboarding scenarios and generates reports

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SCREENSHOTS_DIR="$PROJECT_ROOT/docs/screenshots"
RESULTS_FILE="$PROJECT_ROOT/tests/results.json"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Responsive_Onboarding_UI_v2 - UI Integration Test Suite  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Create screenshots directory
mkdir -p "$SCREENSHOTS_DIR"
echo -e "${GREEN}✓ Created screenshots directory${NC}"

# Run Playwright tests
echo -e "\n${BLUE}Running UI test scenarios...${NC}\n"
cd "$PROJECT_ROOT"

if npm run test:ui; then
  echo -e "\n${GREEN}✓ All UI tests passed!${NC}"
  exit_code=0
else
  echo -e "\n${RED}✗ Some UI tests failed${NC}"
  exit_code=1
fi

# Display results
if [ -f "$RESULTS_FILE" ]; then
  echo -e "\n${BLUE}Test Results Summary:${NC}"
  cat "$RESULTS_FILE" | head -20
fi

echo -e "\n${BLUE}Screenshots saved to: ${SCREENSHOTS_DIR}${NC}"
echo -e "${BLUE}Detailed report: ${RESULTS_FILE}${NC}\n"

exit $exit_code
