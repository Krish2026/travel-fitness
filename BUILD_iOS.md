# iOS Build Process Guide

## Build Workflow Overview

```
Dev Code
  ↓
npm run prebuild:ios  (Generates native code)
  ↓
pod install           (Installs dependencies)
  ↓
xcodebuild            (Compiles iOS binary)
  ↓
.app Bundle           (Runnable app)
```

## Build Variants

### 1. Debug Build (Development)

```bash
npm run build:ios:dev
```

- Optimized for debugging
- Includes debug symbols
- All logging enabled
- Larger binary size
- Use for: Testing on device

### 2. Release Build (Distribution)

```bash
npm run build:ios
```

- Optimized for performance
- Symbol stripping
- Logging disabled
- Smaller binary size
- Use for: App Store, TestFlight

### 3. Xcode Interactive Build

```bash
npm run xcode
```

Opens Xcode IDE for full control:

- Custom build settings
- Code signing configuration
- Simulator/device selection
- Real-time debugging

## Build Configuration Files

### app.json

- App version and build number
- iOS bundle identifier
- Permissions and capabilities
- Deployment target (iOS 14.0+)

### Scripts in package.json

- `prebuild:ios` - Generates ios/ directory
- `build:ios` - Full Release build
- `build:ios:dev` - Full Debug build
- `xcode` - Open in Xcode IDE

### iOS Folder Structure (generated)

```
ios/
├── TravelFitness/          # App source code
├── TravelFitness.xcworkspace
├── TravelFitness.xcodeproj
├── Podfile                 # CocoaPods config
├── Podfile.lock            # Locked dependencies
├── Pods/                   # Installed pods
└── build/                  # Build artifacts
```

## Build Process Step-by-Step

### Step 1: Prebuild (Generate Native Code)

```bash
npm run prebuild:ios
```

- Converts JavaScript/TypeScript to native iOS code
- Generates Xcode project
- Creates CocoaPods configuration
- One-time setup per architecture change

### Step 2: Install Dependencies

```bash
cd ios && pod install && cd ..
```

- Fetches native library dependencies
- Creates xcworkspace
- Integrates with React Native
- Auto-run during prebuild

### Step 3: Compile

```bash
xcodebuild -workspace ios/TravelFitness.xcworkspace \
  -scheme TravelFitness \
  -configuration Release \
  -derivedDataPath ios/build
```

- Compiles Objective-C/Swift
- Links frameworks
- Generates app bundle
- Creates .ipa file

### Step 4: Output

```
ios/build/Build/Products/Release-iphoneos/
├── TravelFitness.app      # Runnable app
├── TravelFitness.app.dSYM # Debug symbols
└── ...
```

## Configuration

### Bundle Identifier

The unique app ID: `com.travelfitness.app`

To change:

1. Update in `app.json`:
   ```json
   {
     "ios": {
       "bundleIdentifier": "com.yourcompany.app"
     }
   }
   ```
2. Rebuild: `npm run prebuild:ios`

### Version Numbers

In `app.json`:

```json
{
  "version": "1.0.0", // Semantic version
  "ios": {
    "buildNumber": "1" // Build integer
  }
}
```

Update before each build.

### Code Signing

```bash
npm run xcode
```

Then in Xcode:

1. Select target
2. Signing & Capabilities tab
3. Set Team
4. Update Bundle ID
5. Select signing certificate

## Troubleshooting

### Build fails at prebuild

```bash
rm -rf ios
npm run prebuild:ios
```

### Pod errors

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
npm run build:ios:dev
```

### Xcode errors

1. Clean build folder: `Cmd+Shift+K`
2. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
3. Rebuild: `npm run build:ios:dev`

### Memory/timeout issues

```bash
# Allocate more resources
xcodebuild ... -parallelizeTargets -j 4
```

## Distribution

### TestFlight (Beta)

1. Build Release: `npm run build:ios`
2. Open in Xcode: `npm run xcode`
3. Product → Archive
4. Upload to App Store Connect
5. Add TestFlight testers

### App Store

1. Follow TestFlight steps
2. Fill app metadata
3. Set pricing
4. Submit for review

### Direct Distribution

For enterprise or internal testing:

1. Obtain development certificate
2. Configure code signing
3. Build: `npm run build:ios:dev`
4. Install via Xcode or over-the-air

## Performance Tips

- Clean before major builds: `npm run ios:clean`
- Parallelize: Add `-j 8` to xcodebuild
- Cache pods: Keep Podfile.lock in git
- Use Release build for final testing
- Profile with Xcode Instruments

## Environment Variables in Builds

Firebase config automatically loaded from `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
```

Verified at build time - check logs if Firebase unavailable.

## Build Time Optimization

Typical times:

- Prebuild: 2-5 minutes (one-time)
- Pod install: 1-2 minutes
- Debug build: 3-5 minutes
- Release build: 5-8 minutes

To speed up:

1. Use debug builds during development
2. Prebuild once, reuse
3. Use incremental builds in Xcode
4. Close simulator before building

## Advanced: Custom Build Script

Edit `scripts/build-ios.sh` for:

- Custom signing
- Automated upload to TestFlight
- Analytics integration
- Code coverage reporting

---

**Quick Commands:**

- `npm run setup` - Full setup
- `npm run prebuild:ios` - Generate iOS code
- `npm run build:ios:dev` - Debug build
- `npm run build:ios` - Release build
- `npm run xcode` - Open in Xcode
- `npm run ios:clean` - Clean everything
