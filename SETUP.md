# Travel Fitness - Setup & Build Guide

## Quick Start (Development)

If you just want to develop with Expo Go:

```bash
npm install
npm start
```

Then scan the QR code with Expo Go app on your iOS/Android device.

---

## Full Development Setup

### Prerequisites

- **macOS** (for iOS development)
- **Xcode 15+** - Download from App Store
- **Python 3.8+** - Required by Xcode
- **Node.js 18+** - From [nodejs.org](https://nodejs.org)
- **CocoaPods** - Installed automatically or manually via `sudo gem install cocoapods`

### Initial Setup

```bash
# Option 1: Automated setup (recommended)
chmod +x scripts/setup-ios.sh
./scripts/setup-ios.sh

# Option 2: Manual setup
npm install
npm run prebuild:ios
cd ios && pod install && cd ..
```

---

## Development Workflow

### Running with Expo Go (Quickest)

```bash
npm start
# or for fresh start:
npm run dev
```

Scan the QR code with Expo Go app.

**Advantages:**

- Fast hot reload
- No build wait time
- Easy for rapid iteration
- Works on physical device over network

**Limitations:**

- Can't test native modules not supported by Expo Go
- No iOS/Android specific features

### Running with Expo Run

```bash
npm run ios          # Simulator
npm run ios -- -d    # Device
```

**Advantages:**

- Uses native iOS code
- Can test native modules
- Closer to production

### Running with Xcode

```bash
npm run xcode
# This opens Xcode with the project
```

Then:

1. Select a target device/simulator
2. Click the Play button
3. App builds and runs

**Benefits:**

- Full control over build settings
- Native debugging
- Device testing

---

## Building for Distribution

### Development/Debug Build

```bash
npm run build:ios:dev
```

Creates an optimized debug build for testing on physical devices.

### Release Build

```bash
npm run build:ios
```

Creates a production-ready build optimized for distribution.

### Environment

```bash
# Prebuild native code (if ios/ directory doesn't exist)
npm run prebuild:ios

# Clean and prebuild
npm run eject
```

---

## Build Scripts

### npm Scripts (in package.json)

```bash
npm start                 # Start Expo dev server (Expo Go)
npm run dev              # Start with clean cache
npm run ios              # Build and run on iOS simulator
npm run prebuild:ios     # Generate iOS native code
npm run xcode            # Open iOS project in Xcode
npm run build:ios        # Build Release version
npm run build:ios:dev    # Build Debug version
npm run ios:clean        # Clean iOS build artifacts
npm run setup            # Full setup (install + prebuild)
npm run kill             # Kill all development processes
```

### Shell Scripts (in scripts/ directory)

```bash
./scripts/setup-ios.sh      # Initial iOS setup
./scripts/build-ios.sh      # Build for iOS (Release)
./scripts/clean.sh          # Clean build artifacts
```

---

## Project Structure

```
.
├── app/                    # Expo Router navigation & screens
│   ├── (tabs)/            # Tab navigation
│   ├── auth/              # Authentication flows
│   ├── client/            # Client-only screens
│   └── trainer/           # Trainer-only screens
│
├── components/            # Reusable React components
│
├── lib/                   # Utilities & logic
│   ├── firebase.ts        # Firebase operations
│   ├── types.ts           # TypeScript types
│   └── validators.ts      # Input validation
│
├── store/                 # Zustand state management
│
├── scripts/               # Build & setup scripts
│
├── ios/                   # Native iOS code (generated after prebuild)
│   ├── TravelFitness.xcworkspace
│   ├── Podfile
│   └── Pods/
│
├── package.json
├── app.json              # Expo configuration
├── tsconfig.json
└── README.md
```

---

## Troubleshooting

### Issue: "ios/ directory not found"

**Solution:**

```bash
npm run prebuild:ios
```

### Issue: "Pod install failed"

**Solution:**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### Issue: "Xcode build fails"

**Solution:**

```bash
npm run ios:clean
npm run prebuild:ios
npm run build:ios:dev
```

### Issue: "Simulator won't start"

**Solution:**

```bash
# Kill all simulators
killall "Simulator" 2>/dev/null || true

# List available simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot <simulator-udid>

# Try again
npm run ios
```

### Issue: "Port 8081 already in use"

**Solution:**

```bash
npm run kill
npm start
```

### Issue: "Module not found"

**Solution:**

```bash
npm install
npm run prebuild:ios
```

---

## Environment Configuration

Create `.env.local` in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Test your configuration:

```bash
npm start
```

If app doesn't connect to Firebase, check that all environment variables are set.

---

## Testing & Quality

```bash
npm run lint              # Run ESLint
npm run lint -- --fix    # Auto-fix issues
```

---

## Common Tasks

### Update Dependencies

```bash
npm update
npm run prebuild:ios
```

### Add New Dependency

```bash
npm install package-name
npm run prebuild:ios    # Rebuild if native module
```

### Reset Everything

```bash
./scripts/clean.sh
npm install
npm run setup
```

### View Logs

```bash
# Expo dev server logs
npm start

# iOS device logs
xcrun simctl spawn booted log stream --predicate 'eventMessage contains "TravelFitness"'

# Xcode build logs
npm run build:ios 2>&1 | tee build.log
```

---

## Development Tips

### Hot Reload

Changes to `.tsx`, `.ts`, `.json` files auto-reload in Expo Go.

### Fast Iteration

1. Use Expo Go for rapid UI changes
2. Use `npm run ios` when testing native features
3. Use Xcode when debugging native code

### Device Testing

```bash
# Get your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Start dev server
npm start

# Scan QR code on device with same network
```

### Performance Profiling

In Xcode:

1. Product → Scheme → Edit Scheme
2. Run → Diagnostics tab
3. Enable desired profilers
4. Run app

---

## Deployment

### TestFlight (Beta Testing)

1. Build Release version: `npm run build:ios`
2. Use Xcode to upload to TestFlight
3. Add TestFlight testers
4. Share TestFlight link

### App Store

1. Create App Store Connect entry
2. Build Release: `npm run build:ios`
3. Upload to App Store Connect
4. Fill in metadata
5. Submit for review

See [Apple documentation](https://developer.apple.com/app-store-connect/) for details.

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)
- [React Native Docs](https://reactnative.dev)
- [Firebase Setup](https://firebase.google.com/docs/setup/ios)
- [Xcode Documentation](https://developer.apple.com/xcode/)

---

## Support

For issues:

1. Check troubleshooting section above
2. Review build logs: `npm run build:ios 2>&1 | tee build.log`
3. Reset everything: `./scripts/clean.sh && npm run setup`
4. Check `.env.local` Firebase config

---

**Last Updated:** March 24, 2026
**Expo Version:** ~54.0.20
**React Native Version:** 0.81.5
