# FitCore — Play Store Publishing Guide

## Pre-requisites Checklist

- [ ] Google Play Developer account ($25 one-time) → https://play.google.com/console
- [ ] Expo account (free) → https://expo.dev
- [ ] EAS CLI installed ✅ (already done)
- [ ] App icons generated ✅ (already done)
- [ ] eas.json configured ✅ (already done)
- [ ] Privacy policy ready ✅ (already done)
- [ ] Store listing written ✅ (already done)

---

## Step 1: Login to Expo

```bash
cd ~/Desktop/fitcore
eas login
```
Enter your expo.dev username and password.

---

## Step 2: Build the AAB

```bash
eas build --platform android --profile production
```

- First time: it will ask to generate a keystore — say **Yes**
- Build runs in the cloud (free tier: ~15 min)
- When done, download the `.aab` file from the link provided

---

## Step 3: Host Privacy Policy

Option A — GitHub Pages (recommended):
1. Create a repo called `fitcore-privacy` on GitHub
2. Copy `store/privacy-policy.html` → rename to `index.html`
3. Push to the repo
4. Enable GitHub Pages in repo Settings → Pages → Deploy from main
5. Your URL will be: `https://daivikreddy.github.io/fitcore-privacy/`

Option B — Any free hosting:
- Upload `store/privacy-policy.html` to Netlify, Vercel, or any static host

---

## Step 4: Create App on Play Console

1. Go to https://play.google.com/console
2. Click **Create app**
3. Fill in:
   - App name: `FitCore - Offline Fitness Tracker`
   - Default language: English (United States)
   - App or Game: App
   - Free or Paid: Free
4. Accept declarations → Create

---

## Step 5: Store Listing

Go to **Grow > Store listing > Main store listing**

Copy from `store/play-store-listing.md`:
- **Short description** (80 chars)
- **Full description**

Upload graphics:
- **App icon**: `assets/icon.png` (512x512 or 1024x1024)
- **Feature graphic**: `store/feature-graphic.png` (1024x500)
- **Screenshots**: Take 4-8 screenshots from your phone/emulator
  ```bash
  # Run app in emulator, then:
  adb shell screencap /sdcard/screenshot.png
  adb pull /sdcard/screenshot.png ~/Desktop/screenshot.png
  ```

---

## Step 6: Content Rating

Go to **Policy > App content > Content rating**
- Start questionnaire
- Category: Utility / Health & Fitness
- Answer all questions (mostly "No" for violence, gambling, etc.)
- Submit

---

## Step 7: Data Safety

Go to **Policy > App content > Data safety**

Select:
- Does your app collect or share any user data? → **No**
- Does your app use any security practices? → **Yes, data is encrypted in transit**

This is accurate since FitCore is 100% offline and stores no data externally.

---

## Step 8: Target Audience

Go to **Policy > App content > Target audience**
- Select: 13+ (or "All ages" if appropriate)
- Not primarily designed for children

---

## Step 9: Upload AAB & Release

1. Go to **Release > Production**
2. Click **Create new release**
3. Upload the `.aab` file downloaded from Step 2
4. Release name: `1.0.0`
5. Release notes:
   ```
   Initial release of FitCore - your 100% offline fitness companion.

   Features:
   • Step tracking with animated progress ring
   • 5 guided workout programs (40+ exercises)
   • Progressive overload tracking
   • Water intake & daily check-in
   • Body measurements & progress photos
   • Achievement badges & streak rewards
   • Smart rest timer
   • Custom workout builder
   • Full data export & backup
   ```
6. Click **Review release**
7. Click **Start rollout to Production**

---

## Step 10: Wait for Review

Google typically reviews within 1-7 days for first submission.
You'll get an email when the app is approved.

---

## Updating the App Later

1. Bump version in `app.json`:
   ```json
   "version": "1.1.0"
   ```
2. Build again:
   ```bash
   eas build --platform android --profile production
   ```
3. Upload new AAB to Play Console → Production → Create new release

---

## Quick Commands Reference

```bash
# Login
eas login

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production

# Submit directly to Play Store (after setting up service account)
eas submit --platform android

# Check build status
eas build:list
```

---

## Files Created for Publishing

```
store/
├── privacy-policy.html    ← Host this publicly
├── play-store-listing.md  ← Copy text to Play Console
└── feature-graphic.png    ← Upload to Play Console

assets/
├── icon.png               ← Play Store icon
├── adaptive-icon.png      ← Android adaptive icon
├── splash-icon.png        ← App splash screen
└── favicon.png            ← Web favicon

eas.json                   ← Build configuration
```
