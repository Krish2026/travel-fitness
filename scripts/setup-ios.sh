#!/bin/bash

# Travel Fitness iOS Setup Script
# This script prepares the development environment for iOS development

set -e

echo "📱 Travel Fitness iOS Setup"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}=== Prerequisites Check ===${NC}"
echo ""

echo -e "${YELLOW}[1/6] Checking Xcode...${NC}"
if ! command -v xcodebuild &> /dev/null; then
  echo -e "${RED}  ✗ Xcode not found. Please install Xcode from App Store.${NC}"
  exit 1
else
  XCODE_VERSION=$(xcodebuild -version | head -1)
  echo -e "${GREEN}  ✓ $XCODE_VERSION${NC}"
fi
echo ""

echo -e "${YELLOW}[2/6] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}  ✗ Node.js not found. Please install from nodejs.org${NC}"
  exit 1
else
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}  ✓ Node.js $NODE_VERSION${NC}"
fi
echo ""

echo -e "${YELLOW}[3/6] Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
  echo -e "${RED}  ✗ npm not found.${NC}"
  exit 1
else
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}  ✓ npm $NPM_VERSION${NC}"
fi
echo ""

echo -e "${YELLOW}[4/6] Checking CocoaPods...${NC}"
if ! command -v pod &> /dev/null; then
  echo -e "${YELLOW}  ⚠ CocoaPods not found. Installing...${NC}"
  sudo gem install cocoapods
else
  POD_VERSION=$(pod --version)
  echo -e "${GREEN}  ✓ CocoaPods $POD_VERSION${NC}"
fi
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}=== Installing Dependencies ===${NC}"
echo ""

echo -e "${YELLOW}[5/6] Installing npm packages...${NC}"
npm install
echo -e "${GREEN}  ✓ npm packages installed${NC}"
echo ""

echo -e "${YELLOW}[6/6] Setting up iOS native code...${NC}"
if [ ! -f ".prettierignore" ]; then
  echo "ios/" >> .prettierignore
  echo "node_modules/" >> .prettierignore
fi

# Prebuild iOS
if [ -d "ios" ]; then
  echo "  ℹ iOS folder already exists"
else
  echo "  ℹ Creating iOS native code..."
  npx expo prebuild --platform ios --clean --install
fi

# Install pods
if [ -d "ios/Pods" ]; then
  echo "  ℹ Updating CocoaPods..."
  cd ios
  pod install --repo-update
  cd ..
else
  echo "  Installing CocoaPods..."
  cd ios
  pod install
  cd ..
fi

echo -e "${GREEN}  ✓ iOS setup complete${NC}"
echo ""

# Step 3: Configuration
echo -e "${BLUE}=== Configuration ===${NC}"
echo ""

echo "Environment setup:"
echo "  ℹ Make sure you have set your Firebase config in .env.local:"
echo "    EXPO_PUBLIC_FIREBASE_API_KEY=..."
echo "    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=..."
echo ""

# Step 4: Done
echo -e "${GREEN}✅ iOS Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Development (Expo Go): npm run dev"
echo "  2. Build for Xcode: npm run xcode"
echo "  3. Build Release: npm run build:ios"
echo "  4. Build Debug: npm run build:ios:dev"
echo ""
echo "For more info: cat SETUP.md"
echo ""
