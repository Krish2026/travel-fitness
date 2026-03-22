# Firebase Setup Guide - Phase 0.2

This guide walks you through setting up Firebase for the Travel Fitness app.

## Prerequisites

- A Google/Firebase account
- Access to [Firebase Console](https://console.firebase.google.com)
- The project initialized from Phase 0.1

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it: **`travel-fitness`**
4. Select your region
5. Agree to terms and click **"Create project"**

## Step 2: Register Your Apps

### iOS App

1. In Firebase Console, click the **iOS icon** (or ⚙️ → Project Settings → Apps)
2. App name: **`Travel Fitness iOS`**
3. Bundle ID: **`com.travelfitness.app`**
4. App Store ID (optional): Leave blank for development
5. Team ID (optional): Leave blank for development
6. Click **"Register app"**
7. Download **`GoogleService-Info.plist`**
8. Place it in: `ios/` folder (created during Phase 0.4 Xcode setup)
9. Copy your credentials for `.env`

### Android App

1. In Firebase Console, click the **Android icon** (or ⚙️ → Project Settings → Apps)
2. App name: **`Travel Fitness Android`**
3. Package name: **`com.travelfitness.app`**
4. SHA-1 certificate (optional for development)
5. Click **"Register app"**
6. Download **`google-services.json`**
7. Place it in: `android/app/` folder (created during Phase 0.4 setup)
8. Copy your credentials for `.env`

## Step 3: Get Firebase Configuration

For both iOS and Android registrations, you'll see configuration details:

```
API Key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Auth Domain: travel-fitness-xxxxx.firebaseapp.com
Project ID: travel-fitness-xxxxx
Storage Bucket: travel-fitness-xxxxx.appspot.com
Messaging Sender ID: XXXXXXXXXX
App ID: 1:XXXXXXXXXX:ios:xxxxxxxxxxxxxxx
```

## Step 4: Create `.env` File

1. Create `.env` file in the project root (copy from `.env.example`)
2. Fill in the values from Step 3:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
EXPO_PUBLIC_TRAINER_PASSWORD=trainer123
```

⚠️ **Never commit `.env` to git** (it's in `.gitignore`)

## Step 5: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Enable both:
   - ✅ Email/Password
   - ✅ Email link (passwordless sign-in) - Optional
4. Click **Save**

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select location: **"Start in test mode"** (for development)
4. Click **"Enable"**

⚠️ **Important**: When ready for production, switch to secure rules from `firestore.rules`

## Step 7: Deploy Firestore Rules

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:

   ```bash
   cd /Users/krishc7/version-control/Client_Work/travel-fitness
   firebase login
   firebase init
   ```

3. Select:
   - ✅ Firestore
   - Project: **travel-fitness** (your project)
   - Rules location: Keep as **firestore.rules**

4. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 8: Create Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click **"Get started"**
3. Keep default security rules for now (test mode)
4. Select Storage location matching your database region
5. Click **"Done"**

## Step 9: Set Storage Rules (Optional)

Replace rules in Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write their own files
    match /{userId}/profile_pictures/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    match /courses/{courseId}/lessons/{lessonId}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null; // Trainers can upload
    }

    match /courses/{courseId}/posts/{postId}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null;
    }
  }
}
```

## Step 10: Test Connection

1. Make sure `.env` is filled with correct credentials
2. Run the app:

   ```bash
   npm run start
   ```

3. Try signing up with a test email

## Troubleshooting

### "Firebase config missing" Error

- Check `.env` file has all credentials
- Variables must start with `EXPO_PUBLIC_`
- Restart dev server after editing `.env`

### "Permission denied" Error

- Check Firestore rules are deployed
- Verify authentication is enabled
- Check user is authenticated before reading/writing

### "Storage error" on video upload

- Enable Firebase Storage
- Check Storage rules allow uploads
- Verify file size isn't too large (>100MB)

## Production Checklist

Before deploying to production:

- [ ] Switch Firestore from test mode to production rules
- [ ] Enable proper authentication (2FA, email verification)
- [ ] Set up Storage security rules
- [ ] Enable billing (if exceeding free tier)
- [ ] Set up backups
- [ ] Configure CORS for web requests
- [ ] Review all security rules
- [ ] Remove debug logging from code
- [ ] Set proper environment variables for production

## Next Steps

Phase 0.2 is now complete! You have:

- ✅ Firebase project created
- ✅ Authentication configured
- ✅ Firestore database ready
- ✅ Storage bucket active
- ✅ Security rules defined

Move to **Phase 0.3: State Management & Local Persistence** next.
