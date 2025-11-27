#!/bin/bash

# Setup script for Responsive Onboarding UI v2
# Installs dependencies and prepares the environment

set -e

echo "🔧 Setting up Responsive Onboarding UI v2"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed.${NC}"
    echo "Please install Node.js 18 or later from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed.${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci || npm install

echo ""
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Install Playwright browsers
echo ""
echo -e "${BLUE}🌐 Installing Playwright browsers...${NC}"
npx playwright install --with-deps chromium

echo ""
echo -e "${GREEN}✓ Playwright browsers installed${NC}"

# Create necessary directories
echo ""
echo -e "${BLUE}📁 Creating project directories...${NC}"
mkdir -p docs/screenshots
mkdir -p logs
mkdir -p dist

echo -e "${GREEN}✓ Directories created${NC}"

# Build the project
echo ""
echo -e "${BLUE}🔨 Building the project...${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Available commands:"
echo "  npm run dev       - Start development server"
echo "  npm run build     - Build for production"
echo "  npm test          - Run UI test suite"
echo "  npm run test:ui   - Run Playwright tests"
echo "  bash run_tests.sh - Run full test suite with reports"
echo ""
