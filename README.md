# CareerPath — The 5-Year Simulator

> **Simulate the Future of Your Career.** An AI-powered career simulation and trajectory engine that transforms your current skills, education, and interests into realistic, divergent 5-year career roadmaps. Compare alternate futures side-by-side, analyze skill gaps, adjust real-time "what-if" market scenarios, track quarterly milestones, and connect with mentors — across **Web**, **iOS**, and **Android**, with **100% Offline-First support**.

---

## Highlights & Capabilities

- 🌐 **Full-Stack Web App** — Built with React 18, Vite, Tailwind CSS, and Recharts.
- 📱 **Native Mobile Apps (iOS & Android)** — Powered by Capacitor 6 with mobile bottom navigation, native status bar theming, and safe-area optimization.
- ⚡ **100% Offline-First Architecture** — Complete client-side simulation engine, LocalStorage data persistence, offline milestone tracking, upskilling journal, and queued outbox.
- 🎯 **5-Year Trajectory Engine** — Deterministic weighted-scoring model projecting salary curves, seniority leaps, and risk/satisfaction metrics.
- 📊 **Interactive Data Visualizations** — Recharts salary trajectory area charts, skill-gap radar charts, and macro market trend analytics.
- 📄 **Resume Reality-Check** — Multi-format parsing (PDF, text, OCR via Tesseract.js) cross-referencing your resume against simulated skill gaps.
- 🤝 **Mentor Network & Milestone Kanban** — Searchable mentor directory, connection request workflow, and quarterly roadmap tracking.
- 🚀 **Automated Mobile CI/CD** — GitHub Actions pipeline building signed release Android APKs on every push and release.

---

## Table of Contents

1. [System Architecture & Tech Stack](#system-architecture--tech-stack)
2. [Offline-First Architecture](#offline-first-architecture)
3. [Mobile Applications (iOS & Android)](#mobile-applications-ios--android)
4. [Key Features](#key-features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Backend Setup](#1-backend-setup)
   - [Frontend Web Setup](#2-frontend-web-setup)
   - [Mobile Setup (Android & iOS)](#3-mobile-setup-android--ios)
7. [Automated CI/CD & APK Builds](#automated-cicd--apk-builds)
8. [Demo Accounts](#demo-accounts)
9. [Deployment](#deployment)
10. [License](#license)

---

## System Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Web** | React 18, Vite 5, Tailwind CSS | Single-Page Application (SPA) with React Router v6 |
| **Mobile Runtime** | Capacitor 6 (`@capacitor/android`, `@capacitor/ios`) | Native wrapper with native plugins (`@capacitor/status-bar`, `@capacitor/splash-screen`) |
| **Mobile UI** | Custom Mobile Bottom Nav & Quick Sheet | Docked 4-tab bar, slide-up drawers, safe-area inset (`pb-safe`) styling |
| **Offline Engine** | Pure JavaScript Weighted Scoring Engine | 100% client-side deterministic career simulator running without network |
| **Offline Storage** | Browser `localStorage` Store (`offlineStore.js`) | Local storage for simulations, milestones, journal, profiles, and queued outbox |
| **Data Visualization** | Recharts & Lucide Icons | Responsive area charts, radar charts, comparative diff cards |
| **Resume & OCR** | PDF.js + Tesseract.js | In-browser PDF extraction and OCR text recognition |
| **Backend API** | Node.js, Express.js (REST API) | Clean MVC architecture with JWT auth via httpOnly cookies & bearer tokens |
| **Database** | MongoDB Atlas | Mongoose ODM with automated seeder for demo accounts & mentors |
| **CI/CD Pipeline** | GitHub Actions (`build-apk.yml`) | Automated build and signing of Android release APKs |

---

## Offline-First Architecture

CareerPath is engineered to work reliably whether you are on high-speed internet, in a spotty network zone, or completely offline on an airplane or subway.

### 1. Dual-Mode Simulation Engine
- **Server Mode**: Connected to Express and MongoDB Atlas for permanent cloud synchronization and multi-device access.
- **Client Engine (`frontend/src/lib/offline/simulation.js`)**: A complete in-browser simulation engine that calculates role progressions, non-linear salary growth curves, demand coefficients, and skill-gap radars entirely on the client.

### 2. Local Persistence (`frontend/src/lib/offline/offlineStore.js`)
When offline, all user interactions are stored locally in the browser/mobile storage:
- **Simulations**: Create, save, and star simulated career trajectories.
- **What-If Scenarios**: Dynamically tweak city tier, upskilling hours, learning months, and network strength with instant offline recalculations.
- **Milestone Kanban**: Create, edit, and advance career milestones (`todo`, `in_progress`, `complete`).
- **Upskilling Journal**: Log learning sessions, track minutes spent, and maintain daily learning streaks offline.
- **Mentor Outbox**: Queue connection requests locally with `queued_offline` status until reconnected.
- **Resume Reality-Check**: Parse resumes and match extracted skills against offline simulated paths.

### 3. Transparent Network Resilience (`frontend/src/lib/api.js` & `useOnlineStatus.js`)
- **Live Status Monitoring**: Real-time network detection via `useOnlineStatus` hook.
- **Visual Status Banners**: Non-intrusive animated `OfflineBanner` alerts the user when operating offline, confirming local data safety, and displays a celebration toast when reconnected.
- **Automatic Fallback**: The API client detects network failures or offline states and automatically routes queries to `offlineStore`, while transparently caching online server data for future offline use.

---

## Mobile Applications (iOS & Android)

CareerPath features dedicated native mobile apps for **Android** and **iOS** powered by Capacitor 6.

### Mobile Features & UX
- **Docked Mobile Bottom Navigation**: Quick 1-tap switching between **Dashboard**, **Simulate**, **Milestones**, and **Mentors**.
- **Slide-Up Action Sheet ("More")**: Instant access to Resume Reality-Check, Market Trends, How it Works, Currency switcher (`INR ₹` / `USD $`), Theme toggle (`Dark` / `Light`), and Profile.
- **Native Status Bar**: Dark styling (`#0e1014`) configured via `@capacitor/status-bar` to match the application's sleek dark theme.
- **Safe-Area Aware**: Implements `pb-safe` and responsive viewports to support iPhone notches, dynamic islands, and Android navigation bars.
- **Zero-Latency Interactions**: Bundled web assets provide near-instant page transitions and smooth 60fps animations.

### Android Release APK
- Package Identifier: `com.careerpath.app`
- Min SDK: Android 22 (Lollipop 5.1) | Target SDK: Android 34
- Build System: Gradle 8.2 + Java 17
- Pre-configured release keystore signing support.

### iOS Xcode Workspace
- Target: iOS 13.0+
- Platform: Capacitor iOS with Swift runtime
- Responsive viewport mode with content insets.

---

## Key Features

### Career Simulation & Exploration
- **Skill Intake Wizard**: Multi-step onboarding collecting skills, proficiencies (sliders), education level, target roles, and constraints.
- **5-Year Simulation Engine**: Generates 2–3 divergent career trajectories (e.g., Specialized Depth vs. Management vs. Domain Pivot).
- **Salary Trajectory Charts**: Interactive Recharts area chart comparing annual compensation across branches.
- **Skill-Gap Radar**: Spider chart visualising your self-assessed skill levels against market expectations.
- **Fork the Path Comparator**: Side-by-side diff comparing risk level, satisfaction score, confidence rating, and 5-year ROI.
- **What-If Scenario Sliders**: Live adjustments for upskilling hours, location multipliers (Tier-1 / Tier-2 / Remote), and network strength.

### Career Execution & Growth
- **Milestone Roadmap Board**: Kanban-style roadmap grouping objectives by year and quarter with status toggling.
- **Upskilling Journal**: Daily learning logger calculating active streaks and total hours invested.
- **Resume Reality-Check**: Upload a PDF or paste text; parses technical skills and calculates match percentages against target roles.
- **Mentor Directory**: Filterable directory of industry professionals across specialties (AI, Full-Stack, Cloud, Data) with connection requests.
- **Admin Analytics Dashboard**: System-wide telemetry showing in-demand skills, average projected salaries, and popular career tracks.

---

## Project Structure

```
CareerPath/
├── .github/
│   └── workflows/
│       └── build-apk.yml          # Automated Android APK build & signing workflow
├── careerpath-mobile/             # Capacitor mobile application package
│   ├── android/                   # Native Android Studio / Gradle project
│   │   ├── app/                   # Android app module, manifests, icons
│   │   └── build.gradle           # Gradle configurations
│   ├── ios/                       # Native Xcode / Swift workspace
│   │   └── App/                   # iOS app delegate, assets, configuration
│   ├── scripts/
│   │   └── copy-frontend.js       # Syncs compiled web assets into mobile dist
│   ├── capacitor.config.json      # Capacitor configuration (appId, plugins, status bar)
│   └── package.json               # Mobile build scripts & dependencies
├── frontend/                      # React + Vite client application
│   ├── src/
│   │   ├── components/            # UI components (Navbar, Footer, MobileBottomNav, OfflineBanner)
│   │   ├── components/charts/     # Recharts components (SalaryTrajectoryChart, SkillGapRadar)
│   │   ├── lib/                   # Auth, API client, currency, theme, useOnlineStatus
│   │   │   └── offline/           # Pure JS simulation engine, offlineStore, resume parser
│   │   └── pages/                 # Route views (Dashboard, Simulate, Milestones, Mentors, etc.)
│   ├── index.html                 # HTML shell with mobile meta tags
│   ├── tailwind.config.js         # Design tokens, color palette, dark mode
│   ├── vite.config.js             # Vite build & proxy configuration
│   └── package.json
├── backend/                       # Express REST API
│   ├── db/                        # MongoDB connection handler
│   ├── models/                    # Mongoose data models (User, Profile, Simulation, Mentor)
│   ├── routes/                    # REST API endpoints (auth, profiles, simulations, mentors)
│   ├── middleware/                # JWT verification and role-based guards
│   ├── engine/                    # Server-side simulation and resume parsing
│   ├── scripts/                   # Database seeder for demo accounts & mentors
│   ├── server.js                  # API entry point
│   └── package.json
├── DEPLOYMENT.md                  # Cloud deployment guide (Vercel + Render)
└── README.md                      # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ / 22 recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Mobile Development (Optional)**:
  - For Android: [Android Studio](https://developer.android.com/studio) with SDK 34 and JDK 17+
  - For iOS: macOS with [Xcode 15+](https://developer.apple.com/xcode/) and CocoaPods

---

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example or create .env:
```

Create `backend/.env`:
```env
API_PORT=5050
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/careerpath?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-jwt-secret-key
```

```bash
# 4. Start the backend in development mode
npm run dev
```

The API will start at `http://localhost:5050`. On initial boot, it automatically connects to MongoDB and seeds demo accounts and mentor profiles.

---

### 2. Frontend Web Setup

```bash
# 1. Open a new terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The web application will open at `http://localhost:5173`. In development mode, Vite automatically proxies `/api` calls to `http://localhost:5050`.

---

### 3. Mobile Setup (Android & iOS)

The mobile package lives in `careerpath-mobile/` and wraps the compiled frontend using Capacitor.

```bash
# 1. Navigate to mobile directory
cd careerpath-mobile

# 2. Install mobile dependencies
npm install

# 3. Build frontend and copy assets to mobile distribution
npm run build
```

#### Running on Android:

```bash
# Sync web build to native Android project
npm run sync:android

# Open project in Android Studio
npm run open:android

# Or build a release APK directly via Gradle:
npm run build:android
```

The compiled APK will be generated at:
`careerpath-mobile/android/app/build/outputs/apk/release/`

#### Running on iOS (macOS required):

```bash
# Sync web build to native iOS project
npm run sync:ios

# Open project in Xcode
npm run open:ios
```

In Xcode, select your simulator or connected iPhone device and press **Cmd + R** to run.

---

## Automated CI/CD & APK Builds

CareerPath includes a dedicated GitHub Actions workflow (`.github/workflows/build-apk.yml`) to automatically compile and sign Android release APKs on GitHub.

### Workflow Triggers
- Automatic run on `push` to `main` / `master`
- Pull requests targeting `main` / `master`
- Manual trigger via **Workflow Dispatch** in the GitHub Actions tab

### Workflow Steps
1. Checks out repository and configures Node.js 22.
2. Installs dependencies in `frontend/` and `careerpath-mobile/`.
3. Sets up Java 17 (Temurin) and Android SDK.
4. Compiles the Vite frontend and copies assets via `scripts/copy-frontend.js`.
5. Synchronizes Capacitor Android configuration.
6. Generates and signs the release APK using secrets (`KEYSTORE_PASSWORD`, `KEY_PASSWORD`).
7. Verifies the APK using `apksigner`.
8. Uploads the finalized `CareerPath.apk` as a downloadable GitHub Action workflow artifact.

---

## Demo Accounts

For presentations, academic evaluations, or quick testing, pre-seeded demo accounts are available:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `ishaan.verma@demo.careerpath.app` | `demo1234` | Full access to Wizard, Simulations, Milestones, Mentors |
| **Mentor (AI / ML)** | `ananya.iyer@demo.careerpath.app` | `mentor1234` | Mentor profile, connection management |
| **Mentor (Fintech)** | `rohan.mehta@demo.careerpath.app` | `mentor1234` | Mentor profile, student inquiries |
| **Mentor (Cloud)** | `sara.cherian@demo.careerpath.app` | `mentor1234` | Mentor profile, reviews |
| **Admin / Faculty** | `admin@careerpath.app` | `admin1234` | Admin analytics dashboard, platform telemetry |

> 💡 **One-Click Demo**: You can also click **"Load demo profile"** directly on the Login page or Intake Wizard for instant evaluation with zero typing.

---

## Deployment

### Backend (Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment Variables:
  - `MONGODB_URI`: MongoDB Atlas connection URI
  - `JWT_SECRET`: Long random secret string
  - `CLIENT_ORIGIN`: Deployed frontend URL (e.g. `https://careerpath.vercel.app`)

### Frontend (Vercel)
- Root directory: `frontend`
- Framework Preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables:
  - `VITE_API_URL`: Your Render backend origin (e.g. `https://careerpath-api.onrender.com` without `/api`)

For full deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## License

Built as an academic capstone project. Distributed under the MIT License.
