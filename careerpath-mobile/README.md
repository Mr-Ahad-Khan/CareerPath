# CareerPath Mobile (iOS & Android)

Cross-platform native mobile application for CareerPath built with **Capacitor 6**, **React 18**, and **Vite**.

---

## App Configuration

- **App ID**: `com.careerpath.app`
- **App Name**: `CareerPath`
- **Capacitor Version**: `^6.0.0`
- **Theme**: Dark mode (`#0e1014` status bar styling)
- **Platforms**:
  - **Android**: Target SDK 34, Min SDK 22, Gradle 8.2
  - **iOS**: iOS 13.0+, Xcode 15+, Swift runtime

---

## Mobile Features

- **Docked Mobile Bottom Navigation**: 4-tab bar (Dashboard, Simulate, Milestones, Mentors).
- **Quick Action Drawer**: Slide-up sheet with Resume Reality-Check, Market Trends, How it Works, Currency Toggle (`INR ₹` / `USD $`), and Theme switch.
- **100% Offline Capable**: Bundled web assets and client-side simulation engine run with zero network connectivity.
- **Native Status Bar**: Configured via `@capacitor/status-bar` to seamlessly integrate with device notches and status bars.

---

## Prerequisites

- **Node.js**: `v20+` or `v22+`
- **npm**: `v9+`
- **For Android**:
  - [Android Studio](https://developer.android.com/studio)
  - Android SDK (Platform 34, Build Tools 34)
  - Java Development Kit (JDK 17)
- **For iOS**:
  - macOS
  - [Xcode 15+](https://developer.apple.com/xcode/)
  - CocoaPods (`sudo gem install cocoapods`)

---

## Setup & Build Instructions

### 1. Install Dependencies

From this directory (`careerpath-mobile`):

```bash
npm install
```

### 2. Build Frontend & Copy Assets

Build the React frontend and bundle assets into `dist/`:

```bash
npm run build
```

This executes:
1. `npm --prefix ../frontend run build`
2. `node scripts/copy-frontend.js` (copies compiled web assets into `careerpath-mobile/dist`)

---

## Android Development

### Sync Assets with Android Project

```bash
npm run sync:android
```

### Open in Android Studio

```bash
npm run open:android
```

From Android Studio, click **Run** to launch on an emulator or connected USB device.

### Build Release APK via CLI

```bash
npm run build:android
```

The APK will be output to:
`android/app/build/outputs/apk/release/`

---

## iOS Development (macOS)

### Sync Assets with iOS Project

```bash
npm run sync:ios
```

### Open in Xcode

```bash
npm run open:ios
```

From Xcode, select your simulator or connected iPhone and press **Cmd + R** to run.

---

## Automated CI/CD

An automated GitHub Actions workflow is set up at [`.github/workflows/build-apk.yml`](../.github/workflows/build-apk.yml). It builds, signs, and publishes the Android release APK on every push to `main` and via manual trigger.
