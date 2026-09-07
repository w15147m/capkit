<div align="center">

# ⚡ CapKit (`create-capkit`)
### Modern, Interactive CLI Toolkit to Scaffold Production-Ready Capacitor Mobile Apps

[![npm version](https://img.shields.io/npm/v/create-capkit?color=blue&style=flat-square)](https://www.npmjs.com/package/create-capkit)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<p align="center">
  Scaffold lightning-fast cross-platform mobile apps for iOS and Android in seconds with your favorite <b>Styling Engine</b>, <b>UI Component Library</b>, and a complete suite of <b>Mobile-Native Reusable Components</b>.
</p>

</div>

---

## 🚀 Quick Start

Initialize a new Capacitor app instantly using your preferred package manager:

```bash
# Using npm
npm create capkit@latest

# Using pnpm
pnpm create capkit

# Using bun
bun create capkit

# Using yarn
yarn create capkit

# Direct execution via npx
npx create-capkit my-mobile-app
```

---

## 🌟 Key Highlights

- ⚡ **Instant Scaffolding**: Interactive Clack CLI with zero setup friction.
- 📱 **Mobile Safe-Area Ready**: Native top/bottom safe-area padding (`env(safe-area-inset-*)`) and viewport fit out of the box.
- 🎨 **6 Styling Engines**: Tailwind CSS v4, SCSS/Sass, CSS Modules, Bootstrap 5, UnoCSS, and Vanilla CSS.
- 📦 **8 UI Component Libraries**: Konsta UI, Ionic React, DaisyUI v5, shadcn/ui, HeroUI, MUI, Framework7, or clean vanilla.
- 🧩 **Modular Mobile Components Suite**: Pre-built, customizable mobile components structured according to strict architectural guidelines.
- 🤖 **Android & iOS Native Support**: Pre-configured Capacitor config and platform setup.
- 🔄 **TypeScript & JavaScript**: Full TypeScript strict mode support or clean modern JavaScript.

---

## 🎨 Styling Solutions Matrix

Choose any modern CSS workflow during project setup:

| Styling Engine | Integration / Tooling | Configuration Highlights |
|---|---|---|
| **Tailwind CSS v4** | `@tailwindcss/vite` | Modern zero-config Vite plugin with `@import "tailwindcss";` |
| **SCSS / Sass** | `sass-embedded` | Auto-scaffolds `src/styles/` with `_variables.scss` & `main.scss` |
| **CSS Modules** | Built-in to Vite | Scoped component styling (`.module.css` / `.module.scss`) |
| **Bootstrap 5** | `bootstrap` + `@popperjs/core` | Classic responsive grid system with utility classes |
| **UnoCSS** | `@unocss/vite` | On-demand atomic CSS engine with `virtual:uno.css` |
| **Vanilla CSS** | Standard CSS | Pure CSS with curated design tokens, CSS variables, and resets |

---

## 📱 Supported UI Component Libraries

CapKit intelligently filters UI libraries based on your chosen styling engine:

| Library | Mobile Native Feel | Engine Support | Key Capabilities |
|---|:---:|:---:|---|
| **Konsta UI** | ⭐⭐⭐⭐⭐ (iOS & MD) | Tailwind CSS v4 | Pixel-perfect native iOS & Material Design with dynamic theming |
| **Ionic React** | ⭐⭐⭐⭐⭐ (Native Feel) | Universal | Industry standard mobile framework with native gestures & routing |
| **DaisyUI v5** | ⭐⭐⭐⭐ (Clean UI) | Tailwind CSS v4 | Semantic component classes with 50+ built-in dark/light themes |
| **shadcn/ui** | ⭐⭐⭐⭐ (Modern) | Tailwind CSS v4 | Radix UI accessible primitives with copy-paste components |
| **HeroUI (NextUI)** | ⭐⭐⭐⭐ (Polished) | Tailwind CSS v4 | Framer Motion fluid animations and rich dark mode variants |
| **Material UI (MUI)** | ⭐⭐⭐ (Android Feel) | Universal | Google Material Design 3 components & theme tokens |
| **Framework7** | ⭐⭐⭐⭐⭐ (iOS & MD) | Universal | Full-featured native mobile app engine with tabs and popups |
| **None / Custom** | — | Universal | Clean, lightweight starter with vanilla design tokens |

---

## 🧩 Reusable Mobile Components System

Every scaffolded template generates a dedicated, production-ready set of reusable components under `src/components/` and interactive tab pages under `src/views/`:

```
src/
├── components/
│   ├── appHeader/          # Sticky glassmorphic top header with safe-area & theme toggle
│   ├── tabBar/             # Bottom tab navigation bar with badge counters
│   ├── appSidebar/         # Slide-out touch navigation drawer with backdrop
│   ├── toast/              # Global notification queue (info, success, warning, error)
│   ├── alertDialog/        # Mobile alert & confirmation dialogs (z-index safe)
│   ├── bottomSheet/        # Draggable touch action sheets with snap points
│   ├── loadingSpinner/     # Native activity spinners
│   ├── skeleton/           # Shimmer loading skeleton placeholders
│   ├── segmentedControl/   # Mobile pill toggles for view switching
│   ├── pullToRefresh/      # Pull-down gesture refresh trigger
│   ├── toggleSwitch/       # Mobile toggle switches
│   └── badge/              # Status badges and chips
└── views/
    ├── homeView/           # Dashboard overview tab
    ├── controlsView/       # Interactive mobile controls tab
    └── overlaysView/       # Dialogs, toasts & loading states tab
```

---

## 📐 Project Structure Rules

Every component and view follows CapKit's modular folder convention:

```
componentName/                 # camelCase folder name
├── ComponentName.tsx          # PascalCase component file
├── ComponentName.module.css   # Optional local styles
└── index.ts                   # Default re-export (export { default } from './ComponentName')
```

---

## 🛠️ CLI Development

To run the CapKit CLI locally for development or contribution:

```bash
# Clone the repository
git clone https://github.com/w15147m/capkit.git
cd capkit

# Install dependencies
npm install

# Test the interactive CLI in development mode
npm run create
```

---

## 📱 Building & Running on Mobile Devices

After generating your application:

```bash
# 1. Start local Vite development server
npm run dev

# 2. Add Android platform (if not already added)
npx cap add android

# 3. Synchronize web assets with native platform
npx cap sync android

# 4. Open in Android Studio to run on an emulator or real device
npx cap open android
```

---

## 📄 License

MIT License © 2026 [CapKit](https://github.com/w15147m/capkit). Built with ❤️ for mobile web developers.
