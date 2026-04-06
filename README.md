<![CDATA[<div align="center">

# 🏋️ FitCore

### Your Complete Offline Fitness Companion

<img src="./assets/banner.png" alt="FitCore App Preview" width="480" />

<br/>

[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://expo.dev/accounts/daivikexes-organization/projects/fitcore/builds/220f1229-623c-4a15-a02a-ab13e03ce632)
[![Built With](https://img.shields.io/badge/Built_With-React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-Private-8B85FF?style=for-the-badge)](#)
[![Version](https://img.shields.io/badge/Version-1.0.0-6C63FF?style=for-the-badge)](#)

**No account. No internet. No excuses.**

Track steps, follow guided workout programs, monitor progress, and build lasting fitness habits — all 100% offline, entirely on your device.

<br/>

[<img src="https://img.shields.io/badge/⬇_DOWNLOAD_APK-6C63FF?style=for-the-badge&logoColor=white" alt="Download" height="42" />](https://expo.dev/accounts/daivikexes-organization/projects/fitcore/builds/220f1229-623c-4a15-a02a-ab13e03ce632)

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [App Screenshots](#-app-screenshots)
- [Workout Programs](#-workout-programs)
- [Exercise Library](#-exercise-library)
- [Progress Tracking](#-progress-tracking)
- [Achievement System](#-achievement-system)
- [Privacy & Data](#-privacy--data)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Building & Deployment](#-building--deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

<table>
<tr>
<td width="50%">

**FitCore** is a premium, feature-rich fitness tracking application designed to work entirely offline. Built with React Native and Expo, it delivers a native Android experience with a stunning dark-mode interface, guided workout programs, step tracking, and comprehensive progress analytics — all without ever requiring an internet connection or user account.

Every piece of data stays on your device. Always.

</td>
<td width="50%">

| Stat | Value |
|:---|:---|
| 🏋️ **Exercises** | 45+ bodyweight exercises |
| 📋 **Programs** | 5 guided training programs |
| 📊 **Duration** | 4–12 week programs |
| 🏆 **Achievements** | 20 unlockable badges |
| 🎨 **Themes** | 7 unlockable color themes |
| 📱 **Size** | Lightweight APK |
| 🔒 **Privacy** | 100% offline — zero data collection |
| 💰 **Price** | Completely free, no ads |

</td>
</tr>
</table>

---

## ✨ Key Features

<table>
<tr>
<td align="center" width="25%">
<br/>
<img src="https://img.shields.io/badge/🦶-Steps-6C63FF?style=for-the-badge" />
<br/><br/>
<b>Step Tracking</b>
<br/><br/>
Animated progress ring with real-time step counting. Set goals from 4K–15K steps. Weekly bar chart history with calorie, distance, and active time calculations.
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<img src="https://img.shields.io/badge/💪-Workouts-FF6584?style=for-the-badge" />
<br/><br/>
<b>Guided Workouts</b>
<br/><br/>
5 structured programs with phased progression. Auto warm-up & cool-down. Smart rest timer with difficulty-based intervals. Haptic feedback on every action.
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<img src="https://img.shields.io/badge/📊-Progress-43E97B?style=for-the-badge" />
<br/><br/>
<b>Analytics Suite</b>
<br/><br/>
Body weight line charts, step bar charts, streak calendar, muscle heat map, exercise records, weekly comparison reports, and progressive overload tracking.
<br/><br/>
</td>
<td align="center" width="25%">
<br/>
<img src="https://img.shields.io/badge/🔒-Privacy-FFB347?style=for-the-badge" />
<br/><br/>
<b>100% Offline</b>
<br/><br/>
Zero network requests. No accounts. No tracking. All data stored locally via AsyncStorage. Export as CSV or JSON backup anytime. Your data, your device.
<br/><br/>
</td>
</tr>
</table>

---

### 🎯 Feature Breakdown

<details>
<summary><b>🏠 Home Dashboard</b></summary>
<br/>

| Feature | Description |
|:---|:---|
| **Step Ring** | Animated circular progress indicator with real-time step count |
| **Stat Cards** | Calories burned, distance walked, active minutes — at a glance |
| **Mood Tracker** | Daily check-in for mood & energy levels |
| **Water Tracker** | 8-glass daily hydration goal with tap-to-fill interface |
| **Workout Calendar** | Monthly view showing workout completion days |
| **Quick Start** | One-tap access to your next scheduled workout |
| **Rest Day Card** | Shows recovery suggestions when no workout is scheduled |
| **Weekly Step Chart** | 7-day bar chart comparing daily step counts |
| **Daily Quote** | Rotating motivational quotes from a curated collection |
| **Pull-to-Refresh** | Refresh all dashboard data with a single gesture |

</details>

<details>
<summary><b>🏋️ Workout Engine</b></summary>
<br/>

| Feature | Description |
|:---|:---|
| **Program Workouts** | Pre-built routines from your selected program |
| **Custom Builder** | Pick any exercises from the full library to create your own routine |
| **Auto Warm-Up** | Every workout starts with a guided warm-up sequence |
| **Auto Cool-Down** | Stretching routine appended to every workout |
| **Set Logger** | Rep/hold counter with +/- buttons and haptic feedback |
| **Smart Rest Timer** | Configurable rest periods (30s/60s/90s/120s) between sets |
| **Progress Bar** | Live visual indicator of workout completion |
| **Workout Timer** | Running clock showing total workout duration |
| **Exercise Modal** | Long-press any exercise for detailed instructions & tips |
| **Progressive Overload** | Automatic suggestions to increase difficulty |
| **Workout Complete** | Celebration screen with stats summary after each session |

</details>

<details>
<summary><b>📊 Progress & Analytics</b></summary>
<br/>

| Feature | Description |
|:---|:---|
| **Step History** | Bar charts with week/month/3-month views |
| **Streak Calendar** | Dual-dot calendar showing workout + step goal days |
| **Body Weight Chart** | Line chart tracking weight over time with trend indicator |
| **Exercise Records** | Personal bests for reps/holds across all exercises |
| **Progressive Overload** | Performance trends showing rep progression over time |
| **Weekly Report** | Week-over-week comparison of workouts, steps, and streaks |
| **Workout History** | Searchable log of all completed workouts |
| **Muscle Heat Map** | Visual map showing which muscle groups you've trained most |
| **Body Measurements** | Track chest, waist, arms, and other measurements |
| **Progress Photos** | Before & after photo comparison with date stamps |
| **Focus Timer** | Meditation & stretching timer with preset durations |

</details>

<details>
<summary><b>👤 Profile & Settings</b></summary>
<br/>

| Feature | Description |
|:---|:---|
| **Profile Card** | Name, age, weight, height, goal, level — all editable |
| **BMI Calculator** | Automatic BMI with category indicator |
| **Achievement Badges** | Grid of 20 badges with progress tracking |
| **Workout Reminder** | Configurable daily push notification |
| **Rest Timer Config** | Choose default rest period (30/60/90/120 seconds) |
| **Weight Unit** | Toggle between kg and lbs |
| **Theme Selector** | 7 color themes unlocked by workout streaks |
| **JSON Backup** | Full data backup exported as sharable JSON |
| **CSV Export** | Workout data exported as spreadsheet-compatible CSV |
| **Data Reset** | Complete data wipe with confirmation dialog |

</details>

---

## 📱 App Screens

<table>
<tr>
<td align="center"><b>Home</b></td>
<td align="center"><b>Workout</b></td>
<td align="center"><b>Progress</b></td>
<td align="center"><b>Profile</b></td>
</tr>
<tr>
<td>
Step ring, stat cards, mood tracker, water tracker, calendar, daily quote
</td>
<td>
Guided exercises, set logger, rest timer, custom builder, live progress
</td>
<td>
Step charts, streak calendar, weight graph, muscle map, records
</td>
<td>
Profile editor, BMI, achievements, themes, settings, backup/export
</td>
</tr>
</table>

---

## 🏋️ Workout Programs

FitCore includes **5 complete training programs**, each designed for a specific fitness goal with multiple progression phases:

<table>
<tr>
<td align="center" width="20%">
<br/>
<h3>🔥</h3>
<b>Fat Loss</b>
<br/>
<code>12 Weeks</code> · <code>3 Days/Week</code>
<br/><br/>
<b>Phases:</b>
<br/>Foundation → Progression → Advanced HIIT
<br/><br/>
Burn fat with progressive cardio + strength circuits. From basic full-body workouts to intense HIIT.
<br/><br/>
</td>
<td align="center" width="20%">
<br/>
<h3>💪</h3>
<b>Muscle Gain</b>
<br/>
<code>12 Weeks</code> · <code>4 Days/Week</code>
<br/><br/>
<b>Phases:</b>
<br/>Foundation → Growth → Peak
<br/><br/>
Push/Pull/Legs/Core split for maximum muscle activation. Progressive overload built in.
<br/><br/>
</td>
<td align="center" width="20%">
<br/>
<h3>🧘</h3>
<b>Flexibility</b>
<br/>
<code>4 Weeks</code> · <code>5 Days/Week</code>
<br/><br/>
<b>Format:</b>
<br/>Morning Flow · Evening Stretch · Full Body · Upper/Lower Focus
<br/><br/>
30-day mobility challenge to improve posture and range of motion.
<br/><br/>
</td>
<td align="center" width="20%">
<br/>
<h3>🏃</h3>
<b>Stamina</b>
<br/>
<code>8 Weeks</code> · <code>3 Days/Week</code>
<br/><br/>
<b>Phases:</b>
<br/>20s/40s → 30s/30s → 40s/20s → Tabata
<br/><br/>
HIIT interval progression from beginner pacing to full Tabata protocol.
<br/><br/>
</td>
<td align="center" width="20%">
<br/>
<h3>🌱</h3>
<b>Beginner</b>
<br/>
<code>6 Weeks</code> · <code>3 Days/Week</code>
<br/><br/>
<b>Phases:</b>
<br/>Gentle Start → Building → Growing → Stronger → Level Up
<br/><br/>
Start from absolute zero with wall push-ups and chair squats, progress to full bodyweight.
<br/><br/>
</td>
</tr>
</table>

---

## 💪 Exercise Library

**45+ bodyweight exercises** across 6 muscle groups, each with detailed instructions, common mistakes, and difficulty ratings:

<table>
<tr>
<td>

**🫸 Push** (7 exercises)
- Push-Up, Knee Push-Up, Diamond Push-Up
- Pike Push-Up, Wide Push-Up, Decline Push-Up
- Archer Push-Up, Wall Push-Up, Chair Dip

</td>
<td>

**🔙 Pull** (4 exercises)
- Inverted Row, Door Frame Row
- Superman Hold, Reverse Snow Angel

</td>
<td>

**🦵 Legs** (8 exercises)
- Bodyweight Squat, Jump Squat
- Bulgarian Split Squat, Reverse Lunge
- Glute Bridge, Single Leg Glute Bridge
- Wall Sit, Calf Raise, Chair Squat

</td>
</tr>
<tr>
<td>

**🎯 Core** (11 exercises)
- Plank, Side Plank, Knee Plank
- Mountain Climber, Bicycle Crunch
- Leg Raise, Dead Bug, Russian Twist
- Flutter Kick, L-Sit Hold, Dragon Flag

</td>
<td>

**❤️‍🔥 Cardio** (7 exercises)
- Burpee, High Knees, Jump Rope
- Star Jump, Jumping Jack
- Lateral Shuffle, Squat Jump

</td>
<td>

**🧘 Flexibility** (11 exercises)
- Cat-Cow, Hip Circle, Thoracic Rotation
- Forward Fold, Hip Flexor Stretch
- Pigeon Pose, Seated Forward Fold
- Butterfly Stretch, Chest Stretch
- Child's Pose, Neck Roll

</td>
</tr>
</table>

> Every exercise includes: **step-by-step instructions** · **common mistakes to avoid** · **difficulty rating (1–5)** · **equipment needed** · **calories per rep** · **exercise variations**

---

## 🏆 Achievement System

Unlock **20 badges** by hitting milestones. Achievements track across workouts, steps, streaks, and personal records:

<table>
<tr>
<td align="center">🏁<br/><b>First Step</b><br/><sub>1st workout</sub></td>
<td align="center">🔥<br/><b>On a Roll</b><br/><sub>3-day streak</sub></td>
<td align="center">🔥<br/><b>Week Warrior</b><br/><sub>7-day streak</sub></td>
<td align="center">🔥<br/><b>Unstoppable</b><br/><sub>30-day streak</sub></td>
<td align="center">👟<br/><b>10K Steps</b><br/><sub>10,000 in a day</sub></td>
</tr>
<tr>
<td align="center">🚀<br/><b>Road Runner</b><br/><sub>15,000 steps</sub></td>
<td align="center">🏋️<br/><b>Getting Serious</b><br/><sub>10 workouts</sub></td>
<td align="center">🏆<br/><b>Quarter Century</b><br/><sub>25 workouts</sub></td>
<td align="center">🥈<br/><b>Half Century</b><br/><sub>50 workouts</sub></td>
<td align="center">⭐<br/><b>Centurion</b><br/><sub>100 workouts</sub></td>
</tr>
<tr>
<td align="center">💪<br/><b>Push-Up Pro</b><br/><sub>25 in one set</sub></td>
<td align="center">👑<br/><b>Push-Up King</b><br/><sub>50 in one set</sub></td>
<td align="center">🟢<br/><b>Iron Core</b><br/><sub>60s plank</sub></td>
<td align="center">🥇<br/><b>Steel Core</b><br/><sub>120s plank</sub></td>
<td align="center">💧<br/><b>Hydrated</b><br/><sub>8 glasses/day</sub></td>
</tr>
<tr>
<td align="center">🔁<br/><b>Rep Machine</b><br/><sub>1,000 total reps</sub></td>
<td align="center">🔁<br/><b>Rep Monster</b><br/><sub>5,000 total reps</sub></td>
<td align="center">⚖️<br/><b>Tracking Progress</b><br/><sub>7 weight logs</sub></td>
<td align="center">🌅<br/><b>Early Bird</b><br/><sub>Workout before 8AM</sub></td>
<td align="center">✏️<br/><b>My Way</b><br/><sub>Custom workout</sub></td>
</tr>
</table>

---

## 🎨 Unlockable Themes

Build workout streaks to unlock premium color themes:

| Theme | Streak Required | Primary Color |
|:---|:---|:---|
| 🟣 **Default** | — | `#6C63FF` Indigo |
| 🔵 **Ocean Blue** | 7-day streak | `#0077B6` Deep Blue |
| 🔴 **Ember** | 14-day streak | `#E63946` Crimson |
| 🟢 **Forest** | 21-day streak | `#2D6A4F` Emerald |
| 🟡 **Gold Edition** | 30-day streak | `#D4A017` Gold |
| 🟣 **Midnight Purple** | 50-day streak | `#7B2D8E` Deep Purple |
| ⚪ **Platinum** | 100-day streak | `#8E8E93` Platinum |

---

## 🔒 Privacy & Data

<table>
<tr>
<td width="60">🚫</td>
<td><b>No Internet Required</b> — The app makes zero network requests. Works in airplane mode.</td>
</tr>
<tr>
<td>🚫</td>
<td><b>No Account Needed</b> — No sign-up, no email, no phone number. Open the app and start.</td>
</tr>
<tr>
<td>🚫</td>
<td><b>No Tracking</b> — No analytics, no telemetry, no ad frameworks. Zero third-party data.</td>
</tr>
<tr>
<td>🚫</td>
<td><b>No Ads</b> — Completely ad-free. No banners, no interstitials, no rewarded ads.</td>
</tr>
<tr>
<td>✅</td>
<td><b>Local Storage Only</b> — All data stored on-device via AsyncStorage. Nothing leaves your phone.</td>
</tr>
<tr>
<td>✅</td>
<td><b>Full Data Export</b> — Export everything as CSV spreadsheet or JSON backup at any time.</td>
</tr>
<tr>
<td>✅</td>
<td><b>Data Reset</b> — One-tap option to completely wipe all app data from your device.</td>
</tr>
</table>

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react" />
<br/><sub>Cross-platform UI</sub>
</td>
<td align="center" width="20%">
<img src="https://img.shields.io/badge/Expo_SDK-54-000020?style=flat-square&logo=expo" />
<br/><sub>Build & deploy</sub>
</td>
<td align="center" width="20%">
<img src="https://img.shields.io/badge/Expo_Router-6.x-000020?style=flat-square&logo=expo" />
<br/><sub>File-based routing</sub>
</td>
<td align="center" width="20%">
<img src="https://img.shields.io/badge/Reanimated-4.1-6C63FF?style=flat-square" />
<br/><sub>Animations</sub>
</td>
<td align="center" width="20%">
<img src="https://img.shields.io/badge/AsyncStorage-2.2-43E97B?style=flat-square" />
<br/><sub>Local persistence</sub>
</td>
</tr>
</table>

### Full Dependency List

| Package | Purpose |
|:---|:---|
| `react-native` 0.81.5 | Core mobile framework (New Architecture enabled) |
| `expo` ~54.0.33 | Managed workflow, build tooling, OTA updates |
| `expo-router` ~6.0.23 | File-based navigation with tab and stack layouts |
| `react-native-reanimated` ~4.1.1 | 60fps animations for step ring, transitions |
| `react-native-gesture-handler` ~2.28.0 | Touch gestures for swipe and press interactions |
| `react-native-gifted-charts` ^1.4.76 | Bar charts and line charts for progress data |
| `react-native-svg` 15.12.1 | Vector graphics for step ring and visual elements |
| `@react-native-async-storage/async-storage` 2.2.0 | Persistent local storage for all app data |
| `expo-sensors` ~15.0.8 | Pedometer API for step counting |
| `expo-haptics` ~15.0.8 | Haptic feedback on buttons and interactions |
| `expo-notifications` ~0.32.16 | Local push notifications for workout reminders |
| `expo-image-picker` ~17.0.10 | Camera/gallery access for progress photos |
| `expo-file-system` ~19.0.21 | File operations for backup/export |
| `expo-sharing` ~14.0.8 | Share exported data files |
| `expo-linear-gradient` ~15.0.8 | Gradient backgrounds and visual accents |
| `@expo/vector-icons` ^15.0.3 | Ionicons icon set throughout the UI |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FitCore App                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐│
│  │  Home   │  │ Workout │  │ Progress │  │Profile ││
│  │  Tab    │  │   Tab   │  │   Tab    │  │  Tab   ││
│  └────┬────┘  └────┬────┘  └────┬─────┘  └───┬────┘│
│       │            │            │             │      │
│  ┌────┴────────────┴────────────┴─────────────┴───┐ │
│  │              24 Reusable Components            │ │
│  │  StepRing · ExerciseCard · RestTimer · BMI     │ │
│  │  WorkoutCalendar · MuscleHeatMap · FocusTimer  │ │
│  │  AchievementBadges · PhotoProgress · etc.      │ │
│  └────────────────────┬──────────────────────────┘  │
│                       │                              │
│  ┌────────────────────┴──────────────────────────┐  │
│  │                 Custom Hooks                   │  │
│  │  useStepCounter · useWorkout · useStorage     │  │
│  └────────────────────┬──────────────────────────┘  │
│                       │                              │
│  ┌────────────────────┴──────────────────────────┐  │
│  │              Utilities & Data                  │  │
│  │  progress · calories · notifications · export │  │
│  │  exercises (45+) · programs (5) · themes (7)  │  │
│  └────────────────────┬──────────────────────────┘  │
│                       │                              │
│  ┌────────────────────┴──────────────────────────┐  │
│  │          AsyncStorage (Local Only)             │  │
│  │  Profile · Workouts · Steps · Settings · etc. │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Navigation Flow

```
App Launch
  │
  ├── First Launch ──→ Onboarding (4 steps)
  │                     ├── 1. Welcome Screen
  │                     ├── 2. Goal Selection
  │                     ├── 3. Fitness Level
  │                     └── 4. Profile Details ──→ Home
  │
  └── Returning User ──→ Tab Navigator
                          ├── 🏠 Home
                          ├── 🏋️ Workout
                          ├── 📊 Progress
                          └── 👤 Profile
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- **Expo CLI** (`npx expo`)
- **Android device** or **emulator** (for step tracking)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/daivikreddy/fitcore.git

# 2. Navigate to the project
cd fitcore

# 3. Install dependencies
npm install

# 4. Start the development server
npx expo start
```

### Running on Device

```bash
# Start with Android
npx expo start --android

# Or scan the QR code with Expo Go
npx expo start
```

> **Note:** Step tracking requires a built APK — it is not available in Expo Go. All other features work normally in Expo Go.

---

## 📂 Project Structure

```
fitcore/
├── app/                          # Expo Router screens
│   ├── _layout.js                # Root layout with onboarding guard
│   ├── onboarding.js             # 4-step onboarding flow
│   └── (tabs)/                   # Tab navigator
│       ├── _layout.js            # Tab bar configuration
│       ├── index.js              # 🏠 Home dashboard
│       ├── workout.js            # 🏋️ Workout engine + custom builder
│       ├── progress.js           # 📊 Analytics & tracking
│       └── profile.js            # 👤 Settings & achievements
│
├── components/                   # 24 reusable UI components
│   ├── StepRing.js               # Animated circular step progress
│   ├── ExerciseCard.js           # Exercise display with set tracking
│   ├── ExerciseModal.js          # Detailed exercise info overlay
│   ├── ExerciseAnimation.js      # Exercise demonstration visuals
│   ├── RestTimer.js              # Configurable rest countdown
│   ├── WorkoutTimer.js           # Live workout duration clock
│   ├── WorkoutComplete.js        # Post-workout celebration screen
│   ├── WorkoutCalendar.js        # Monthly workout completion grid
│   ├── WaterTracker.js           # Daily hydration tracker
│   ├── MoodTracker.js            # Mood & energy check-in
│   ├── WeeklyChart.js            # 7-day step bar chart
│   ├── WeeklyReport.js           # Week-over-week comparison
│   ├── WorkoutHistory.js         # Scrollable workout log
│   ├── StreakCalendar.js         # Dual-dot streak calendar
│   ├── MuscleHeatMap.js          # Muscle group training frequency
│   ├── ProgressOverload.js       # Rep progression tracking
│   ├── BodyMeasurements.js       # Body measurement inputs
│   ├── PhotoProgress.js          # Before/after photo tracker
│   ├── BMICard.js                # BMI calculator display
│   ├── AchievementBadges.js      # Badge grid with unlock states
│   ├── ThemeSelector.js          # Color theme picker
│   ├── FocusTimer.js             # Meditation/stretching timer
│   ├── DailyQuote.js             # Motivational quote display
│   └── ExerciseNotes.js          # Personal exercise notes
│
├── hooks/                        # Custom React hooks
│   ├── useStepCounter.js         # Pedometer integration
│   ├── useWorkout.js             # Workout state machine
│   └── useStorage.js             # AsyncStorage interface
│
├── data/                         # Static data & content
│   ├── exercises.js              # 45+ exercises with full metadata
│   ├── programs.js               # 5 training programs with phases
│   ├── achievements.js           # 20 achievement definitions
│   ├── themes.js                 # 7 color theme definitions
│   └── warmup.js                 # Warm-up & cool-down routines
│
├── utils/                        # Utility functions
│   ├── progress.js               # Step history, workout logs, streaks
│   ├── calories.js               # Calorie & distance calculations
│   ├── notifications.js          # Local push notification scheduling
│   ├── export.js                 # CSV data export
│   └── backup.js                 # JSON backup/restore
│
├── constants/                    # Design tokens
│   └── theme.js                  # Colors, spacing, radius, fonts
│
├── store/                        # Store listing assets
│   ├── play-store-listing.md     # Google Play description
│   ├── privacy-policy.html       # Privacy policy page
│   └── feature-graphic.png       # Play Store feature graphic
│
├── assets/                       # App icons & splash screen
│   ├── icon.png                  # App icon (1024×1024)
│   ├── adaptive-icon.png         # Android adaptive icon
│   ├── splash-icon.png           # Splash screen icon
│   └── favicon.png               # Web favicon
│
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── package.json                  # Dependencies & scripts
└── babel.config.js               # Babel configuration
```

---

## 📦 Building & Deployment

### Development Build

```bash
# Create development build
npx eas build --profile development --platform android
```

### Preview APK

```bash
# Build APK for testing
npx eas build --profile preview --platform android
```

### Production Build

```bash
# Build AAB for Play Store
npx eas build --profile production --platform android
```

### Submit to Play Store

```bash
# Submit to Google Play
npx eas submit --platform android
```

### Build Profiles (eas.json)

| Profile | Output | Distribution | Use Case |
|:---|:---|:---|:---|
| `development` | Dev client | Internal | Development & debugging |
| `preview` | APK | Internal | Testing on real devices |
| `production` | AAB | Play Store | Public release |

---

## 📊 Design System

FitCore uses a carefully crafted dark-mode design system:

```
Colors
───────────────────────────────
Background    #0A0A0F    ██
Surface       #13131A    ██
Surface 2     #1C1C26    ██
Primary       #6C63FF    ██
Primary Light #8B85FF    ██
Secondary     #FF6584    ██
Success       #43E97B    ██
Warning       #FFB347    ██
Text          #FFFFFF    ██
Text Muted    #8888AA    ██
Border        #2A2A3A    ██
Gold          #FFD700    ██

Spacing                  Radius
──────────               ──────────
xs:  4px                 card:   16px
sm:  8px                 button: 12px
md: 16px                 pill:   50px
lg: 24px
xl: 32px
xxl: 48px
```

---

## 📄 Permissions

| Permission | Platform | Purpose |
|:---|:---|:---|
| `ACTIVITY_RECOGNITION` | Android | Step counting via device pedometer |
| Camera (runtime) | Android | Progress photos |
| Notifications (runtime) | Android | Workout reminders |

---

## 📬 Contact

**Developer:** Daivik Reddy  
**Email:** daivikreddy@gmail.com  
**Organization:** daivikexes-organization

---

<div align="center">

### 📥 Download FitCore

[<img src="https://img.shields.io/badge/⬇_DOWNLOAD_LATEST_APK-6C63FF?style=for-the-badge" alt="Download" height="48" />](https://expo.dev/accounts/daivikexes-organization/projects/fitcore/builds/220f1229-623c-4a15-a02a-ab13e03ce632)

<br/>

**Start your fitness journey today. It takes 25 minutes. No equipment. No excuses.**

<br/>

Built with ❤️ in India

<sub>FitCore v1.0.0 · © 2026 Daivik Reddy · All rights reserved</sub>

</div>
]]>
