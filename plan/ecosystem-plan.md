# 📱 CapKit Ecosystem Expansion Plan

This document outlines the roadmap and integration matrix for expanding **CapKit** (`create-capkit`) into a comprehensive multi-option Capacitor scaffolding ecosystem.

---

## 1. 🎨 Styling & CSS Solutions

| Solution | Engine / Tooling | Config & Integration Strategy |
|---|---|---|
| **Tailwind CSS v4** | `@tailwindcss/vite` | Modern zero-config Vite plugin with `@import "tailwindcss";` |
| **SCSS / Sass** | `sass-embedded` | Native Vite support for `.scss` / `.module.scss` styling |
| **CSS Modules** | Built into Vite | Scoped component styling (`.module.css` / `.module.scss`) |
| **Bootstrap 5** | `bootstrap` + `@popperjs/core` | Classic responsive grid system and utility classes |
| **UnoCSS** | `@unocss/vite` | On-demand atomic CSS engine with preset wind/icons |
| **Vanilla CSS** | Standard CSS | Pure CSS with curated design tokens, CSS variables, and reset |

---

## 2. 📱 UI Component Libraries

| Library | Mobile Native Feel | Tailwind Required | Key Benefits |
|---|:---:|:---:|---|
| **Konsta UI** | ⭐⭐⭐⭐⭐ (iOS & Material) | ✅ Yes | Pixel-perfect iOS & Android native looks with dynamic theming |
| **Ionic React** | ⭐⭐⭐⭐⭐ (Native Feel) | ❌ Optional | Full cross-platform components, gestures, and native transitions |
| **DaisyUI** | ⭐⭐⭐⭐ (Clean UI) | ✅ Yes | Lightweight Tailwind plugin with 50+ themes and semantic classes |
| **shadcn/ui** | ⭐⭐⭐⭐ (Modern aesthetic) | ✅ Yes | Radix UI primitives with copy-paste Tailwind components |
| **HeroUI (NextUI)** | ⭐⭐⭐⭐ (Polished) | ✅ Yes | Smooth micro-animations and rich dark mode variants |
| **Framework7** | ⭐⭐⭐⭐⭐ (iOS & MD) | ❌ Standalone | Comprehensive native mobile UI engine with routing and tabs |
| **MUI (Material UI)** | ⭐⭐⭐ (Android feel) | ❌ Standalone | Google Material Design 3 components |

---

## 3. 🔌 Capacitor Native Plugins (Multi-Select)

CLI prompts can allow developers to multi-select essential native device capabilities:

| Plugin | Package | Capabilities |
|---|---|---|
| 📷 **Camera & Photos** | `@capacitor/camera` | Camera capture, photo gallery selection, crop & save |
| 📍 **Geolocation** | `@capacitor/geolocation` | Real-time GPS device coordinates and tracking |
| 🔔 **Push Notifications** | `@capacitor/push-notifications` | Firebase Cloud Messaging (FCM) & Apple APNS |
| ⚡ **Haptics** | `@capacitor/haptics` | Native device vibrations, impact, and notification feedback |
| 💾 **Preferences / SQLite** | `@capacitor/preferences`<br>`@capacitor-community/sqlite` | Key-value persistent storage & high-performance offline SQL |
| 🔒 **Biometric Auth** | `@aparajita/capacitor-biometric-auth` | Fingerprint & Face ID authentication |
| 🎨 **Status Bar & Splash** | `@capacitor/status-bar`<br>`@capacitor/splash-screen` | Control status bar color, overlay, and launch splash screens |
| 🌐 **Network & Device** | `@capacitor/network`<br>`@capacitor/device` | Online/offline detection, battery status, and device metadata |
| 📤 **Share & Clipboard** | `@capacitor/share`<br>`@capacitor/clipboard` | Native system share dialog and clipboard read/write |

---

## 4. 🧩 Reusable Mobile Components System

Every scaffolded template can include a clean, production-ready set of reusable mobile components adhering to the project structure guidelines:

### A. Core Layout Components
- **`appHeader/` (Navbar)**:
  - Sticky glassmorphic top bar with safe-area padding (`env(safe-area-inset-top)`).
  - Title, subtitle, leading back button, trailing action buttons, and dark/light mode toggle.
- **`tabBar/` / `appFooter/` (Bottom Navigation)**:
  - Mobile bottom tab bar with safe-area padding (`env(safe-area-inset-bottom)`).
  - Active indicators, icon + label tabs, and notification count badges.
- **`appSidebar/` / `drawer/`**:
  - Smooth slide-in side drawer navigation with touch backdrop.

### B. Feedback & Overlay Components
- **`toast/` (Toast / Snackbar)**:
  - Global toast notification queue with variants: `success`, `error`, `warning`, `info`.
  - Auto-dismiss timer, progress bar, and touch swipe-to-dismiss.
- **`alertDialog/` / `modal/`**:
  - Mobile alert and confirmation popups with iOS & Material Design styled action buttons.
- **`bottomSheet/` / `actionSheet/`**:
  - Draggable bottom sheet modal with snap points and handle bar for mobile menus.
- **`loadingSpinner/` & `skeleton/`**:
  - Smooth animated skeletons and native-styled activity spinners for asynchronous data loading.

### C. Interactive Mobile Controls
- **`segmentedControl/`**: Pill/slider toggle tabs for sub-views.
- **`pullToRefresh/`**: Native mobile pull-down gesture to trigger data refresh.
- **`toggleSwitch/` & `badge/`**: Standard mobile switch and chip indicators.

---

## 5. 🔀 Navigation & Routing

| Router | Best For | Features |
|---|---|---|
| **React Router v7** | Standard Web & Mobile | Declarative routes, nested layouts, loader data |
| **Ionic React Router** | Native Mobile Navigation | Native iOS/Android slide animations & stack navigation |
| **TanStack Router** | Type-Safe Architecture | 100% type-safe search params and route matching |

---

## 6. 📦 State Management & Data Fetching

| Library | Category | Description |
|---|---|---|
| **Zustand** | Global State | Simple, unopinionated, small-footprint hook-based store |
| **TanStack Query** | Server State | Caching, deduplication, optimistic updates, and offline sync |
| **Redux Toolkit (RTK)** | Global State | Predictable, enterprise-scale state with RTK Query |

---

## 7. ✨ Icons & Animation Packs

- **Lucide React**: Clean, modern SVG icon set for mobile interfaces.
- **Ionicons**: iOS & Material Design styled icon set matching mobile standards.
- **Motion (Framer Motion)**: Fluid spring animations and drag gestures for mobile swipe interactions.

---

## 8. 🚀 Multi-Framework Support Roadmap

- **Phase 1 (Current)**: React 19 (TypeScript / JavaScript)
- **Phase 2**: Vue 3 (Vite + Vue + Pinia / Ionic Vue)
- **Phase 3**: Svelte 5 (Vite + Svelte + Runes)
- **Phase 4**: Solid.js (Vite + Solid)

---

## 9. 🛠️ CLI Architecture Implementation Strategy

1. **Option Groups**:
   - `Framework` → React (future: Vue, Svelte, Solid)
   - `Language` → TypeScript / JavaScript
   - `Styling` → Tailwind CSS v4, SCSS, CSS Modules, Bootstrap, Vanilla CSS
   - `UI Library` → (Filtered based on styling selection): Konsta UI, Ionic, DaisyUI, shadcn/ui, None
   - `Component Pack` → Layout (Header/Footer/Sidebar), Overlays (Toasts/Alerts/Sheets)
   - `Plugins` → Multi-select Capacitor plugins with auto-configured Android permissions in `AndroidManifest.xml`
2. **Template Generators**:
   - Dynamic `package.json` dependency resolution.
   - Modular file generation per UI library and plugin combination.
   - Dynamic `README.md` documenting selected plugins and usage examples.

