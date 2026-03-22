# Google Services Setup Guide

This guide explains how to add Google Services configuration files to your local development environment without committing them to git.

## ⚠️ Important: Never Commit These Files

The following files contain sensitive credentials and are **blocked by .gitignore**:

- `ios/GoogleService-Info.plist`
- `android/app/google-services.json`

## 📱 iOS Setup

### Step 1: Get GoogleService-Info.plist

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **travel-fitness**
3. Click ⚙️ **Project Settings**
4. Go to **Your apps** section
5. Click your **iOS app**
6. Click **Download GoogleService-Info.plist**

### Step 2: Add to Your Project

```bash
# Place the file in your iOS folder
cp ~/Downloads/GoogleService-Info.plist ios/GoogleService-Info.plist

# Verify it's not staged by git
git status
# Should show: "nothing to commit, working tree clean"
```

### Step 3: Verify It's Ignored

```bash
git check-ignore ios/GoogleService-Info.plist
# Should output: ios/GoogleService-Info.plist
```

---

## 🤖 Android Setup

### Step 1: Get google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **travel-fitness**
3. Click ⚙️ **Project Settings**
4. Go to **Your apps** section
5. Click your **Android app**
6. Click **Download google-services.json**

### Step 2: Add to Your Project

```bash
# Place the file in your Android app folder
cp ~/Downloads/google-services.json android/app/google-services.json

# Verify it's not staged by git
git status
# Should show: "nothing to commit, working tree clean"
```

### Step 3: Verify It's Ignored

```bash
git check-ignore android/app/google-services.json
# Should output: android/app/google-services.json
```

---

## 🔄 For Team Members

When another developer clones the repo:

1. Clone the repo
2. Create `.env` from template:
   ```bash
   cp .env.example .env
   ```
3. Add Firebase config files:
   - Download `GoogleService-Info.plist` → place in `ios/`
   - Download `google-services.json` → place in `android/app/`
4. Git will ignore these files (no accidental commits)

---

## ✅ Verification

After setup, verify no secrets will be committed:

```bash
# Check git status
git status

# Should be empty or show only expected files
# Should NOT show:
# - .env
# - GoogleService-Info.plist
# - google-services.json
```

---

## 🚫 If You Accidentally Commit

If you accidentally commit these files:

```bash
# Remove from git (but keep local copy)
git rm --cached ios/GoogleService-Info.plist
git rm --cached android/app/google-services.json

# Commit the removal
git commit -m "Remove Google Services config from git"
git push

# THEN: Regenerate credentials in Firebase
```

---

## 📋 File Locations

```
travel-fitness/
├── ios/
│   └── GoogleService-Info.plist  ← Add here (NOT in git)
├── android/
│   └── app/
│       └── google-services.json  ← Add here (NOT in git)
├── .env                          ← Add here (NOT in git)
└── .gitignore                    ← Blocks these files
```

---

## ✅ Security Best Practices

- ✅ Never commit `.env`, `GoogleService-Info.plist`, or `google-services.json`
- ✅ Always use `.env.example` as a template
- ✅ Check `.gitignore` before committing
- ✅ If exposed, regenerate credentials immediately
- ✅ Use environment variables for sensitive data

---

**Your local setup is secure when these files are not in git!** ✅
