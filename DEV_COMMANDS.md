# Development Commands Quick Reference

## 🚀 Quick Start

```bash
npm install              # Install dependencies
npm start               # Start Expo dev server
# Scan QR code with Expo Go app
```

## 📱 Running the App

| Command           | Use Case                                     |
| ----------------- | -------------------------------------------- |
| `npm start`       | Expo Go (fast reload, any device on network) |
| `npm run dev`     | Expo Go with clean cache                     |
| `npm run ios`     | iOS simulator (native code)                  |
| `npm run android` | Android emulator (native code)               |
| `npm run xcode`   | Open Xcode IDE for full control              |

## 🛠️ Building

### For Distribution

```bash
npm run build:ios       # Production Release build
npm run build:ios:dev   # Debug build for testing
```

### Native Code Setup

```bash
npm run prebuild:ios    # Generate iOS native code
npm run setup           # Full setup (npm install + prebuild)
npm run eject           # Clean rebuild from scratch
```

## 🧹 Cleanup

```bash
npm run ios:clean       # Remove iOS build artifacts
./scripts/clean.sh      # Complete cleanup
npm run kill            # Kill stuck dev processes
```

## 📋 Development Scripts

```bash
npm run lint            # Check code style
npm run lint -- --fix   # Auto-fix style issues
```

## 🔧 Initial Setup

```bash
# Automated (recommended)
chmod +x scripts/setup-ios.sh
./scripts/setup-ios.sh

# Manual
npm install
npm run prebuild:ios
cd ios && pod install && cd ..
```

## ⚠️ Troubleshooting

```bash
# Port already in use
npm run kill && npm start

# Pod issues
cd ios && pod install --repo-update && cd ..

# Everything broken
./scripts/clean.sh && npm run setup
```

## 📚 Full Documentation

See [SETUP.md](./SETUP.md) for:

- Detailed setup instructions
- Prerequisites
- Build workflows
- Environment configuration
- Deployment guide
- Troubleshooting

## 💡 Pro Tips

1. **Develop with Expo Go** for fastest feedback loop
2. **Use `npm run ios`** when testing native features
3. **Open Xcode** (`npm run xcode`) only when deep debugging
4. **Scan QR code** to test on physical iOS device
5. **Check `.env.local`** if Firebase operations fail

## Environment Variables

Create `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Device Testing

```bash
# On same network
npm start
# Scan QR code with your iOS device in Expo Go
```

## Viewing Logs

```bash
# Expo dev server
npm start

# iOS simulator
xcrun simctl spawn booted log stream
```
