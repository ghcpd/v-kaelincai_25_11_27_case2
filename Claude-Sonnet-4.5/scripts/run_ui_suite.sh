#!/bin/bash

# Responsive Onboarding UI v2 - UI Test Suite Runner
# This script runs all 5 UI integration test scenarios with screenshot capture

set -e

echo "🚀 Responsive Onboarding UI v2 - Test Suite"
echo "============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Create screenshots directory if it doesn't exist
mkdir -p docs/screenshots

echo -e "${BLUE}📸 Screenshots will be saved to: docs/screenshots/${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Please run setup.sh first.${NC}"
    exit 1
fi

# Run Playwright tests with detailed output
echo -e "${BLUE}🧪 Running UI Test Scenarios...${NC}"
echo ""
echo "Test Scenarios:"
echo "  1. Desktop Layout (1920x1080) - No overlap verification"
echo "  2. 13-inch Laptop (1280x800) - Responsive breakpoint test"
echo "  3. Mobile Safari (390x844) - CTA visibility test"
echo "  4. Dark Mode Markdown - HTML rendering & sanitization"
echo "  5. Keyboard Navigation - Full accessibility test"
echo ""

# Run Playwright tests
npx playwright test --reporter=list,html

TEST_EXIT_CODE=$?

echo ""
echo "============================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All UI tests passed successfully!${NC}"
    echo ""
    echo -e "${GREEN}📊 Test Summary:${NC}"
    echo "   ✓ Desktop Layout - No Overlap"
    echo "   ✓ 13-inch Laptop Breakpoint"
    echo "   ✓ Mobile Safari CTA Visibility"
    echo "   ✓ Dark Mode Markdown Rendering"
    echo "   ✓ Keyboard Navigation"
    echo ""
    echo -e "${BLUE}📸 Screenshots:${NC}"
    ls -lh docs/screenshots/ 2>/dev/null || echo "   (Screenshots directory empty or not found)"
    echo ""
    echo -e "${BLUE}📄 Full HTML Report:${NC}"
    echo "   Open: playwright-report/index.html"
else
    echo -e "${RED}❌ Some tests failed (Exit code: $TEST_EXIT_CODE)${NC}"
    echo ""
    echo -e "${YELLOW}📄 Check the HTML report for details:${NC}"
    echo "   Open: playwright-report/index.html"
    exit $TEST_EXIT_CODE
fi
