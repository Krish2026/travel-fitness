# Travel Fitness - Source Code Structure

## Folder Organization

```
src/
├── screens/          # Screen/Page components (one per route)
├── components/       # Reusable UI components
├── navigation/       # Navigation setup and routing
├── firebase/         # Firebase queries and API wrappers
├── context/          # React Context for state management
├── redux/            # Redux store, reducers, slices (if using Redux)
├── hooks/            # Custom React hooks
├── utils/            # Helper functions and utilities
├── config/           # Configuration files (Firebase, API keys, etc.)
├── assets/           # Static assets (images, icons, fonts)
│   ├── images/
│   ├── icons/
│   └── fonts/
└── constants.js      # App-wide constants and enums
```

## File Naming Conventions

- **Screens**: `ScreenNameScreen.js` (e.g., `HomeScreen.js`, `ProfileScreen.js`)
- **Components**: `ComponentName.js` (e.g., `Button.js`, `Card.js`)
- **Hooks**: `useHookName.js` (e.g., `useAuth.js`, `useFetch.js`)
- **Utils**: `functionName.js` (e.g., `helpers.js`, `validators.js`)

## Development Phases

### Phase 0: Project Setup

- [x] 0.1 - React Native Init & Xcode Integration
- [ ] 0.2 - Firebase Configuration & Authentication
- [ ] 0.3 - State Management & Local Persistence
- [ ] 0.4 - Navigation Structure & Base App Layout

### Phase 1: MVP Features

- [ ] 1.1 - Sign-Up Flow
- [ ] 1.2 - Client Profile Creation
- [ ] 1.3 - Trainer Profile Creation
- [ ] 1.4 - Client Home Page
- [ ] 1.5 - Progress Tracking Chart
- [ ] 1.6 - Trainer Dashboard & Settings
- [ ] 1.7 - Course Creation
- [ ] 1.8 - Video Upload
- [ ] 1.9 - Course Browsing
- [ ] 1.10 - Course Enrollment
- [ ] 1.11 - Lesson Playback & Checklist
- [ ] 1.12 - Progress Bar & Leveling
- [ ] 1.13 - Community Chat
- [ ] 1.14 - Posts/Feed
- [ ] 1.15 - Full Auth & Session Management

### Phase 2: Advanced Features

- [ ] 2.1 - Multi-Trainer Support
- [ ] 2.2 - Paywall & Stripe Integration
- [ ] 2.3 - AI Affirmation Generator
- [ ] 2.4 - AI Progress Prediction
- [ ] 2.5 - AI Chatbot
- [ ] 2.6 - Notifications
- [ ] 2.7 - Meal Plans
- [ ] 2.8 - Meal Tracking

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run start`
3. Run on iOS: `npm run start:ios`
4. Run on Android: `npm run start:android`

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

## Build & Deployment

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```
