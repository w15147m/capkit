# 📱 CapKit Ecosystem Expansion Plan

This document tracks the implementation status and roadmap for expanding **CapKit** (`create-capkit`) into a comprehensive multi-option Capacitor scaffolding ecosystem.

**Legend:**
- ✔️ **Implemented & Available in CLI**
- ⏳ **Upcoming / Next Phase**

---

## 1. 🎨 Styling & CSS Solutions

| Status | Solution | Engine / Tooling | Config & Integration Strategy |
|:---:|---|---|---|
| ✔️ | **Tailwind CSS v4** | `@tailwindcss/vite` | Modern zero-config Vite plugin with `@import "tailwindcss";` |
| ✔️ | **SCSS / Sass** | `sass-embedded` | Scaffolds `src/styles/` with `_variables.scss` & `main.scss` |
| ✔️ | **CSS Modules** | Built into Vite | Scoped component styling (`.module.css` / `.module.scss`) |
| ✔️ | **Bootstrap 5** | `bootstrap` + `@popperjs/core` | Classic responsive grid system and utility classes |
| ✔️ | **UnoCSS** | `@unocss/vite` | On-demand atomic CSS engine with `virtual:uno.css` |
| ✔️ | **Vanilla CSS** | Standard CSS | Pure CSS with curated design tokens, CSS variables, and reset |

---

## 2. 📱 UI Component Libraries

| Status | Library | Mobile Native Feel | Tailwind Required | Key Benefits |
|:---:|---|:---:|:---:|---|
| ✔️ | **Konsta UI** | ⭐⭐⭐⭐⭐ (iOS & Material) | ✅ Yes | Pixel-perfect iOS & Android native looks with dynamic theming |
| ✔️ | **DaisyUI v5** | ⭐⭐⭐⭐ (Clean UI) | ✅ Yes | Lightweight Tailwind plugin with 50+ themes and semantic classes |
| ✔️ | **shadcn/ui** | ⭐⭐⭐⭐ (Modern aesthetic) | ✅ Yes | Radix UI primitives with copy-paste Tailwind components |
| ✔️ | **HeroUI (NextUI)** | ⭐⭐⭐⭐ (Polished) | ✅ Yes | Smooth micro-animations and rich dark mode variants |
| ✔️ | **Ionic React** | ⭐⭐⭐⭐⭐ (Native Feel) | ❌ Optional | Full cross-platform components, gestures, and native transitions |
| ✔️ | **Framework7** | ⭐⭐⭐⭐⭐ (iOS & MD) | ❌ Standalone | Comprehensive native mobile UI engine with routing and tabs |
| ✔️ | **MUI (Material UI)** | ⭐⭐⭐ (Android feel) | ❌ Standalone | Google Material Design 3 components |
| ✔️ | **None** | — | ❌ No | Clean starter without extra UI library overhead |

---

## 3. 🧩 Reusable Mobile Components System

Every scaffolded template includes a clean, production-ready set of reusable mobile components adhering to the project structure guidelines:

### A. Core Layout Components
- ✔️ **`appHeader/` (Navbar)**:
  - Sticky glassmorphic top bar with safe-area padding (`env(safe-area-inset-top)`).
  - Title, subtitle, leading back button, trailing action buttons, and dark/light mode toggle.
- ✔️ **`tabBar/` / `appFooter/` (Bottom Navigation)**:
  - Mobile bottom tab bar with safe-area padding (`env(safe-area-inset-bottom)`).
  - Active indicators, icon + label tabs, and notification count badges.
- ✔️ **`appSidebar/` / `drawer/`**:
  - Smooth slide-in side drawer navigation with touch backdrop.

### B. Feedback & Overlay Components
- ✔️ **`toast/` (Toast / Snackbar)**:
  - Global toast notification queue with variants: `success`, `error`, `warning`, `info`.
  - Auto-dismiss timer, progress bar, and fixed viewport stacking.
- ✔️ **`alertDialog/` / `modal/`**:
  - Mobile alert and confirmation popups with iOS & Material Design styled action buttons and elevated z-index above bottom bars.
- ✔️ **`bottomSheet/` / `actionSheet/`**:
  - Draggable bottom sheet modal with snap points and handle bar for mobile menus.
- ✔️ **`loadingSpinner/` & `skeleton/`**:
  - Smooth animated skeletons and native-styled activity spinners for asynchronous data loading.

### C. Interactive Mobile Controls
- ✔️ **`segmentedControl/`**: Pill/slider toggle tabs for sub-views.
- ✔️ **`pullToRefresh/`**: Native mobile pull-down gesture to trigger data refresh.
- ✔️ **`toggleSwitch/` & `badge/`**: Standard mobile switch and chip indicators.

*(✔️ Implemented & generated for all UI systems: Tailwind CSS, Konsta UI, DaisyUI, Ionic React, HeroUI, Material UI, Framework7, and Vanilla/SCSS/Bootstrap)*

---

## 4. 🔌 Capacitor Native Plugins (Multi-Select Prompt)

| Status | Plugin | Package | Capabilities |
|:---:|---|---|---|
| ⏳ | 📷 **Camera & Photos** | `@capacitor/camera` | Camera capture, photo gallery selection, crop & save |
| ⏳ | 📍 **Geolocation** | `@capacitor/geolocation` | Real-time GPS device coordinates and tracking |
| ⏳ | 🔔 **Push Notifications** | `@capacitor/push-notifications` | Firebase Cloud Messaging (FCM) & Apple APNS |
| ⏳ | ⚡ **Haptics** | `@capacitor/haptics` | Native device vibrations, impact, and notification feedback |
| ⏳ | 💾 **Preferences / SQLite** | `@capacitor/preferences`<br>`@capacitor-community/sqlite` | Key-value persistent storage & high-performance offline SQL |
| ⏳ | 🔒 **Biometric Auth** | `@aparajita/capacitor-biometric-auth` | Fingerprint & Face ID authentication |
| ⏳ | 🎨 **Status Bar & Splash** | `@capacitor/status-bar`<br>`@capacitor/splash-screen` | Control status bar color, overlay, and launch splash screens |
| ⏳ | 🌐 **Network & Device** | `@capacitor/network`<br>`@capacitor/device` | Online/offline detection, battery status, and device metadata |
| ⏳ | 📤 **Share & Clipboard** | `@capacitor/share`<br>`@capacitor/clipboard` | Native system share dialog and clipboard read/write |

---

## 5. 🔀 Navigation & Routing

| Status | Router | Best For | Features |
|:---:|---|---|---|
| ⏳ | **React Router v7** | Standard Web & Mobile | Declarative routes, nested layouts, loader data |
| ⏳ | **Ionic React Router** | Native Mobile Navigation | Native iOS/Android slide animations & stack navigation |
| ⏳ | **TanStack Router** | Type-Safe Architecture | 100% type-safe search params and route matching |

---

## 6. 📦 State Management & Data Fetching

| Status | Library | Category | Description |
|:---:|---|---|---|
| ⏳ | **Zustand** | Global State | Simple, unopinionated, small-footprint hook-based store |
| ⏳ | **TanStack Query** | Server State | Caching, deduplication, optimistic updates, and offline sync |
| ⏳ | **Redux Toolkit (RTK)** | Global State | Predictable, enterprise-scale state with RTK Query |

---

## 7. ✨ Icons & Animation Packs

| Status | Library | Features |
|:---:|---|---|
| ✔️ | **Lucide React** | Clean, modern SVG icon set for mobile interfaces |
| ✔️ | **Ionicons** | iOS & Material Design styled icon set |
| ✔️ | **Motion (Framer Motion)** | Fluid spring animations and drag gestures (HeroUI) |

---

## 8. 🚀 Multi-Framework Support Roadmap

- ✔️ **Phase 1 (Current)**: React 19 (TypeScript & JavaScript)
- ⏳ **Phase 2**: Vue 3 (Vite + Vue 3 + Pinia / Ionic Vue)
- ⏳ **Phase 3**: Svelte 5 (Vite + Svelte + Runes)
- ⏳ **Phase 4**: Solid.js (Vite + Solid)

---

## 9. 🛠️ Current Implementation Summary

1. **Option Groups**:
   - `Framework` → ✔️ React 19
   - `Language` → ✔️ TypeScript / JavaScript
   - `Styling` → ✔️ Tailwind CSS v4, SCSS, CSS Modules, Bootstrap 5, UnoCSS, Vanilla CSS
   - `UI Library` → ✔️ Konsta UI, DaisyUI v5, shadcn/ui, HeroUI, Ionic React, Framework7, MUI, None
   - `Platform` → ✔️ Android (Capacitor)
2. **Generators**:
   - ✔️ Dynamic `package.json` dependency resolution.
   - ✔️ Dynamic `vite.config` (Tailwind, UnoCSS, standard).
   - ✔️ Modular file & template generation.
   - ✔️ Reusable mobile components suite.
   - ⏳ Capacitor Native Plugins multi-select & automated Android permissions.
   - ⏳ Routing / Navigation generators.
   - ⏳ State management setup generators.


