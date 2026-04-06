#!/bin/bash

# Travel Fitness iOS Build Script
# This script builds the app for iOS using Xcode

set -e

echo "🚀 Starting iOS Build..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUILD_TYPE="${1:-Release}"
WORKSPACE="ios/TravelFitness.xcworkspace"
SCHEME="TravelFitness"
DERIVED_DATA="ios/build"

echo -e "${YELLOW}Build Configuration:${NC}"
echo "  Type: $BUILD_TYPE"
echo "  Workspace: $WORKSPACE"
echo "  Scheme: $SCHEME"
echo "  Derived Data: $DERIVED_DATA"
echo ""

# Step 1: Check if Node modules are installed
echo -e "${YELLOW}[1/5] Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo "  Installing npm packages..."
  npm install
else
  echo "  ✓ npm packages already installed"
fi
echo ""

# Step 2: Prebuild native code
echo -e "${YELLOW}[2/5] Prebuilding native code...${NC}"
if [ -d "ios" ]; then
  echo "  Removing old iOS build..."
  rm -rf ios/build
  echo "  ✓ Old build removed"
else
  echo "  Running prebuild..."
  npx expo prebuild --platform ios --clean
fi
echo ""

# Step 3: Install pods
echo -e "${YELLOW}[3/5] Installing CocoaPods...${NC}"
if [ -d "ios/Pods" ]; then
  echo "  ✓ Pods already installed"
else
  echo "  Installing pods..."
  cd ios
  pod install --repo-update
  cd ..
  echo "  ✓ Pods installed"
fi
echo ""

# Step 4: Build with Xcode
echo -e "${YELLOW}[4/5] Building with Xcode...${NC}"
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$BUILD_TYPE" \
  -derivedDataPath "$DERIVED_DATA" \
  build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}  ✓ Build successful!${NC}"
else
  echo -e "${RED}  ✗ Build failed!${NC}"
  exit 1
fi
echo ""

# Step 5: Show build artifacts
echo -e "${YELLOW}[5/5] Build artifacts:${NC}"
BUILD_PATH="$DERIVED_DATA/Build/Products/${BUILD_TYPE}-iphoneos"
if [ -d "$BUILD_PATH" ]; then
  echo "  📦 Location: $BUILD_PATH"
  ls -lh "$BUILD_PATH" | grep -E "\.app$|\.dsym$" | awk '{print "    " $9}'
fi
echo ""

echo -e "${GREEN}✅ iOS Build Complete!${NC}"
echo ""
echo "Next steps:"
echo "  • Open Xcode: npm run xcode"
echo "  • Run on simulator: npm run ios"
echo "  • Run on device: Use Xcode to build and run"
echo ""
