#!/bin/bash

# Travel Fitness Cleanup Script
# This script removes build artifacts and temporary files

echo "🧹 Cleaning up..."
echo ""

# Colors for output
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to remove directory safely
remove_dir() {
  local dir=$1
  local name=$2
  
  if [ -d "$dir" ]; then
    echo -e "${YELLOW}Removing $name...${NC}"
    rm -rf "$dir"
    echo -e "${GREEN}  ✓ Done${NC}"
  fi
}

# Function to remove file safely
remove_file() {
  local file=$1
  local name=$2
  
  if [ -f "$file" ]; then
    echo -e "${YELLOW}Removing $name...${NC}"
    rm -f "$file"
    echo -e "${GREEN}  ✓ Done${NC}"
  fi
}

echo -e "${YELLOW}Cleaning build artifacts...${NC}"
remove_dir "ios/build" "Build artifacts"
remove_dir "ios/Pods" "CocoaPods"
remove_file "ios/Podfile.lock" "Podfile.lock"
echo ""

echo -e "${YELLOW}Cleaning cache...${NC}"
remove_dir ".expo" "Expo cache"
remove_dir "android/.gradle" "Gradle cache"
echo ""

echo -e "${YELLOW}Cleaning node modules (optional)...${NC}"
echo "Warning: This will require npm install to run again"
read -p "Remove node_modules? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  remove_dir "node_modules" "node_modules"
  remove_file "package-lock.json" "package-lock.json"
fi
echo ""

echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo "To reinstall:"
echo "  npm install"
echo "  npm run prebuild:ios"
echo ""
