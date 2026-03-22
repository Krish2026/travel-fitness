# Development Guide - Travel Fitness App

## Quick Start

### 1. Initial Setup

```bash
# Clone the repository
cd travel-fitness

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Fill in your Firebase credentials in .env
```

### 2. Running the App

#### Development Mode

```bash
# Start the development server
npm run start

# For iOS (Xcode)
npm run start:ios

# For Android (Android Studio)
npm run start:android
```

#### Building for Production

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

### 3. Project Structure

```
travel-fitness/
├── src/                          # Source code
│   ├── screens/                  # Screen components
│   ├── components/               # Reusable components
│   ├── navigation/               # Navigation setup
│   ├── firebase/                 # Firebase operations
│   ├── context/                  # Context/state
│   ├── redux/                    # Redux store (if used)
│   ├── utils/                    # Helper functions
│   ├── config/                   # Configuration
│   ├── hooks/                    # Custom hooks
│   └── assets/                   # Static files
├── App.js                        # App entry point
├── app.json                      # App configuration
├── package.json                  # Dependencies
└── README.md                     # Project README
```

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: Redux or React Context (to be decided in Phase 0.3)
- **Navigation**: React Navigation
- **Testing**: Jest
- **Build Tools**: Xcode (iOS), Android Studio (Android)

## Development Workflow

### Phase Structure

1. **Phase 0**: Setup & Infrastructure ✅ (In Progress: 0.1)
2. **Phase 1**: MVP Features (Auth, Courses, Progress)
3. **Phase 2**: Advanced Features (AI, Payments, Multi-Trainer)

### Each Phase Includes:

- Feature implementation
- Firebase integration
- UI/UX components
- Error handling
- Testing

## Common Commands

```bash
# Development
npm run start              # Start dev server
npm run start:ios          # Start for iOS
npm run start:android      # Start for Android

# Building
npm run build:ios          # Build for iOS
npm run build:android      # Build for Android
npm run build:ios:local    # Local Xcode build

# Testing & Linting
npm run test               # Run tests
npm run lint               # Lint code
npm run eject              # Eject from Expo (irreversible)
```

## Environment Variables

Required variables in `.env`:

```
# Firebase
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx

# App
TRAINER_PASSWORD=xxx
```

## Debugging

### iOS

- Run with: `npm run start:ios`
- Open Xcode: `open ios/TravelFitness.xcworkspace`
- Use Xcode debugger or Chrome DevTools

### Android

- Run with: `npm run start:android`
- Open Android Studio: `open android/`
- Use Android Studio debugger or Chrome DevTools

## Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Add iOS app with bundle ID: `com.travelfitness.app`
3. Add Android app with package name: `com.travelfitness.app`
4. Download `GoogleService-Info.plist` (iOS) and `google-services.json` (Android)
5. Add credentials to `.env` file
6. Enable authentication methods (Email/Password for Phase 1)
7. Create Firestore database

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

## Troubleshooting

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection issues

- Verify `.env` file has correct credentials
- Check Firebase project is active
- Ensure app is registered in Firebase Console

### Xcode build failures

```bash
# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Rebuild
npm run build:ios:local
```

### Android build failures

```bash
# Clear gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm run build:android
```

## Next Steps

After Phase 0.1 is complete:

1. Move to **Phase 0.2** - Firebase Configuration
2. Set up authentication
3. Create user roles (Client/Trainer)
4. Proceed to remaining Phase 0 subsections

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org)
- [Jest Documentation](https://jestjs.io)
