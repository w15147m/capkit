#!/usr/bin/env node

// src/index.ts
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";
import path15 from "pathe";

// src/prompts/index.ts
import * as p from "@clack/prompts";
import pc from "picocolors";

// src/types/index.ts
function makeProjectOptions(base) {
  return {
    ...base,
    get tailwind() {
      return base.style === "tailwind";
    },
    get konsta() {
      return base.uiLibrary === "konsta";
    }
  };
}

// src/prompts/index.ts
import path2 from "pathe";

// src/utils/filesystem.ts
import fs from "fs-extra";
import path from "pathe";
async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}
async function writeFile(filePath, content) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}
async function writeJson(filePath, data) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, data, { spaces: 2 });
}
function isDirectoryEmpty(dirPath) {
  if (!fs.existsSync(dirPath)) return true;
  const files = fs.readdirSync(dirPath);
  return files.length === 0 || files.length === 1 && files[0] === ".git";
}
function formatPackageName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/^[._]/, "").replace(/[^a-z0-9-~]+/g, "-");
}

// src/utils/pkgManager.ts
import { execa } from "execa";
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) return "npm";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("yarn")) return "yarn";
  return "npm";
}
async function installDependencies(targetDir, packageManager) {
  const args = packageManager === "yarn" ? [] : ["install"];
  await execa(packageManager, args, {
    cwd: targetDir,
    stdio: "pipe"
  });
}

// src/prompts/index.ts
async function runPrompts(targetDirArg) {
  console.log();
  p.intro(pc.bgCyan(pc.black(" CapKit \u2014 Create Capacitor App ")));
  const isCurrentDir = targetDirArg === ".";
  let targetDir = isCurrentDir ? process.cwd() : targetDirArg ? path2.resolve(process.cwd(), targetDirArg) : "";
  let initialProjectName = isCurrentDir ? formatPackageName(path2.basename(process.cwd())) || "my-capacitor-app" : targetDirArg ? formatPackageName(targetDirArg) : "";
  const results = await p.group(
    {
      projectName: () => {
        if (targetDirArg) {
          return Promise.resolve(initialProjectName);
        }
        return p.text({
          message: "Project name:",
          placeholder: "my-capacitor-app",
          defaultValue: "my-capacitor-app",
          validate(value) {
            if (!value) return "Project name is required";
            if (value.trim() === ".") return void 0;
            if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(value))
              return 'Invalid package name. Use lowercase, numbers, and hyphens (or "." for current directory)';
          }
        });
      },
      overwrite: ({ results: results2 }) => {
        const rawName2 = String(results2.projectName).trim();
        if (rawName2 === "." || isCurrentDir) {
          targetDir = process.cwd();
          initialProjectName = formatPackageName(path2.basename(process.cwd())) || "my-capacitor-app";
        } else {
          targetDir = path2.resolve(process.cwd(), rawName2);
          initialProjectName = formatPackageName(rawName2);
        }
        if (!isDirectoryEmpty(targetDir)) {
          return p.confirm({
            message: targetDir === process.cwd() ? "Current directory is not empty. Continue and write files?" : `Directory "${rawName2}" is not empty. Overwrite?`,
            initialValue: false
          });
        }
        return Promise.resolve(true);
      },
      framework: () => p.select({
        message: "Select a frontend framework:",
        options: [
          { value: "react", label: "React", hint: "Vite + React 19" }
        ],
        initialValue: "react"
      }),
      language: () => p.select({
        message: "Select language:",
        options: [
          { value: "ts", label: "TypeScript", hint: "Recommended" },
          { value: "js", label: "JavaScript" }
        ],
        initialValue: "ts"
      }),
      style: () => p.select({
        message: "Select a styling solution:",
        options: [
          { value: "tailwind", label: "Tailwind CSS v4", hint: "Utility-first, recommended" },
          { value: "scss", label: "SCSS / Sass", hint: "Nested CSS with variables" },
          { value: "cssmodules", label: "CSS Modules", hint: "Scoped per-component styling" },
          { value: "bootstrap", label: "Bootstrap 5", hint: "Classic responsive grid" },
          { value: "unocss", label: "UnoCSS", hint: "On-demand atomic CSS engine" },
          { value: "vanilla", label: "Vanilla CSS", hint: "Pure CSS design tokens" }
        ],
        initialValue: "tailwind"
      }),
      uiLibrary: ({ results: results2 }) => {
        const style = results2.style;
        const isTailwind = style === "tailwind";
        const universalOptions = [
          { value: "ionic", label: "Ionic React", hint: "Full native-feel cross-platform UI" },
          { value: "framework7", label: "Framework7", hint: "iOS & Material native mobile UI engine" },
          { value: "mui", label: "Material UI", hint: "Google Material Design 3 components" },
          { value: "none", label: "None", hint: "No UI library" }
        ];
        const tailwindOptions = [
          { value: "konsta", label: "Konsta UI", hint: "Pixel-perfect iOS & Android native look" },
          { value: "daisy", label: "DaisyUI", hint: "50+ themes, semantic Tailwind classes" },
          { value: "shadcn", label: "shadcn/ui", hint: "Radix primitives + copy-paste components" },
          { value: "heroui", label: "HeroUI", hint: "Polished animations and dark mode" }
        ];
        const options = isTailwind ? [...tailwindOptions, ...universalOptions] : universalOptions;
        return p.select({
          message: "Select a UI component library:",
          options,
          initialValue: isTailwind ? "konsta" : "none"
        });
      },
      android: () => p.confirm({
        message: "Add Capacitor Android platform?",
        initialValue: true
      }),
      packageManager: () => p.select({
        message: "Select package manager:",
        options: [
          { value: "npm", label: "npm" },
          { value: "pnpm", label: "pnpm" },
          { value: "bun", label: "bun" },
          { value: "yarn", label: "yarn" }
        ],
        initialValue: detectPackageManager()
      }),
      install: () => p.confirm({
        message: "Install dependencies now?",
        initialValue: true
      })
    },
    {
      onCancel() {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
    }
  );
  if (results.overwrite === false) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }
  const rawName = String(results.projectName).trim();
  const isDot = rawName === "." || isCurrentDir;
  const finalTargetDir = isDot ? process.cwd() : path2.resolve(process.cwd(), rawName);
  const finalProjectName = isDot ? formatPackageName(path2.basename(process.cwd())) || "my-capacitor-app" : formatPackageName(rawName);
  return makeProjectOptions({
    projectName: finalProjectName,
    targetDir: finalTargetDir,
    framework: "react",
    language: results.language ?? "ts",
    style: results.style ?? "tailwind",
    uiLibrary: results.uiLibrary ?? "none",
    android: Boolean(results.android),
    packageManager: results.packageManager,
    install: Boolean(results.install)
  });
}

// src/generators/project.ts
import path14 from "pathe";
import { execa as execa2 } from "execa";

// src/generators/packageJson.ts
function generatePackageJson(options) {
  const dependencies = {
    react: "^19.2.8",
    "react-dom": "^19.2.8"
  };
  const devDependencies = {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    vite: "^8.2.2"
  };
  if (options.language === "ts") {
    devDependencies["typescript"] = "^5.7.2";
  }
  const scripts = {
    dev: "vite",
    build: "vite build",
    preview: "vite preview"
  };
  switch (options.style) {
    case "tailwind":
      dependencies["tailwindcss"] = "^4.3.3";
      dependencies["@tailwindcss/vite"] = "^4.3.3";
      break;
    case "scss":
      devDependencies["sass-embedded"] = "^1.89.0";
      break;
    case "bootstrap":
      dependencies["bootstrap"] = "^5.3.3";
      dependencies["@popperjs/core"] = "^2.11.8";
      break;
    case "unocss":
      devDependencies["unocss"] = "^66.10.0";
      devDependencies["@unocss/vite"] = "^66.10.0";
      break;
    case "cssmodules":
    case "vanilla":
      break;
  }
  switch (options.uiLibrary) {
    case "konsta":
      dependencies["konsta"] = "^5.4.0";
      break;
    case "daisy":
      devDependencies["daisyui"] = "^5.0.43";
      break;
    case "shadcn":
      dependencies["class-variance-authority"] = "^0.7.1";
      dependencies["clsx"] = "^2.1.1";
      dependencies["tailwind-merge"] = "^3.3.0";
      dependencies["lucide-react"] = "^0.513.0";
      break;
    case "heroui":
      dependencies["@heroui/react"] = "^2.7.8";
      dependencies["framer-motion"] = "^11.18.2";
      break;
    case "ionic":
      dependencies["@ionic/react"] = "^8.5.0";
      dependencies["ionicons"] = "^7.4.0";
      break;
    case "framework7":
      dependencies["framework7"] = "^9.1.3";
      dependencies["framework7-react"] = "^9.1.3";
      break;
    case "mui":
      dependencies["@mui/material"] = "^7.1.1";
      dependencies["@emotion/react"] = "^11.14.0";
      dependencies["@emotion/styled"] = "^11.14.0";
      break;
    case "none":
      break;
  }
  if (options.android) {
    dependencies["@capacitor/core"] = "^8.5.1";
    dependencies["@capacitor/android"] = "^8.5.1";
    devDependencies["@capacitor/cli"] = "^8.5.1";
  }
  return {
    name: options.projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts,
    dependencies,
    devDependencies
  };
}

// src/generators/capacitor.ts
import path3 from "pathe";
async function generateCapacitorConfig(targetDir, options) {
  const config = {
    appId: `com.example.${options.projectName.replace(/[^a-zA-Z0-9]/g, "")}`,
    appName: options.projectName,
    webDir: "dist",
    server: {
      url: "http://localhost:5173",
      cleartext: true
    }
  };
  await writeJson(path3.join(targetDir, "capacitor.config.json"), config);
}
async function generateAndroidGradleConfig(targetDir) {
  const gradlePropertiesContent = `# Project-wide Gradle settings
org.gradle.jvmargs=-Xmx1536m
android.useAndroidX=true

# Project-specific JDK: Use Java 21 for Capacitor Android build
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
`;
  await writeFile(path3.join(targetDir, "android", "gradle.properties"), gradlePropertiesContent);
}

// src/generators/files.ts
import path13 from "pathe";

// src/generators/tailwindComponents.ts
import path4 from "pathe";

// src/generators/templates/components/appHeader.ts
function getAppHeaderTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface AppHeaderProps {
  title: string
  subtitle?: string
  platform?: string
  isNative?: boolean
  darkMode?: boolean
  onToggleTheme?: () => void
  onOpenSidebar?: () => void
}` : ""}

export default function AppHeader({
  title,
  subtitle,
  platform = 'web',
  isNative = false,
  darkMode = true,
  onToggleTheme,
  onOpenSidebar,
}${isTs ? ": AppHeaderProps" : ""}) {
  return (
    <header
      className={\`sticky top-0 z-40 border-b backdrop-blur-md transition-colors px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] \${
        darkMode ? 'bg-slate-950/85 border-slate-800/80 text-slate-100' : 'bg-white/85 border-slate-200/80 text-slate-900'
      }\`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {onOpenSidebar && (
            <button
              type="button"
              onClick={onOpenSidebar}
              className={\`p-1.5 rounded-xl border transition-colors \${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }\`}
              aria-label="Open Sidebar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 leading-none">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={\`p-1.5 rounded-full transition-colors \${
                darkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
              }\`}
              aria-label="Toggle Theme"
            >
              {darkMode ? '\u{1F319}' : '\u2600\uFE0F'}
            </button>
          )}
          <span
            className={\`text-[10px] font-bold px-2 py-0.5 rounded-full text-white tracking-wider \${
              isNative ? 'bg-emerald-600' : 'bg-blue-600'
            }\`}
          >
            {platform.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
`;
}

// src/generators/templates/components/tabBar.ts
function getTabBarTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}

export interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  darkMode?: boolean
}` : ""}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  darkMode = true,
}${isTs ? ": TabBarProps" : ""}) {
  return (
    <nav
      className={\`fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md transition-colors pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 px-2 \${
        darkMode ? 'bg-slate-950/90 border-slate-800/80 text-slate-400' : 'bg-white/90 border-slate-200/80 text-slate-500'
      }\`}
    >
      <div className="max-w-md mx-auto grid grid-flow-col auto-cols-fr items-center">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={\`flex flex-col items-center justify-center py-1 relative transition-all active:scale-95 \${
                isActive
                  ? darkMode
                    ? 'text-cyan-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : 'hover:text-slate-200'
              }\`}
            >
              <div className="relative">
                <div className="w-5 h-5 flex items-center justify-center">{tab.icon}</div>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
`;
}

// src/generators/templates/components/appSidebar.ts
function getAppSidebarTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  items: SidebarItem[]
  darkMode?: boolean
}` : ""}

export default function AppSidebar({
  isOpen,
  onClose,
  title = 'Menu',
  items,
  darkMode = true,
}${isTs ? ": AppSidebarProps" : ""}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={\`relative w-72 max-w-[80vw] h-full shadow-2xl z-10 flex flex-col p-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] transition-colors \${
          darkMode ? 'bg-slate-900 border-r border-slate-800 text-slate-100' : 'bg-white border-r border-slate-200 text-slate-900'
        }\`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={\`p-1.5 rounded-lg \${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}\`}
          >
            \u2715
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick?.()
                onClose()
              }}
              className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left \${
                darkMode
                  ? 'hover:bg-slate-800/80 text-slate-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }\`}
            >
              {item.icon && <span className="w-5 h-5 flex items-center justify-center text-slate-400">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500">
          CapKit Mobile Starter \u2022 v0.1.0
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/components/toast.ts
function getToastTemplate(isTs) {
  return `import { useEffect } from 'react'
import { createPortal } from 'react-dom'

${isTs ? `export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  type?: ToastType
  message: string
  duration?: number
  onClose: () => void
}` : ""}

export default function Toast({
  type = 'info',
  message,
  duration = 3000,
  onClose,
}${isTs ? ": ToastProps" : ""}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const typeStyles${isTs ? ": Record<string, string>" : ""} = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-slate-950',
    info: 'bg-blue-600 text-white',
  }

  const icons${isTs ? ": Record<string, string>" : ""} = {
    success: '\u2713',
    error: '\u2715',
    warning: '\u26A0',
    info: '\u2139',
  }

  return createPortal(
    <div
      className="fixed inset-x-4 z-[9999] flex justify-center pointer-events-none"
      style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
    >
      <div
        className={\`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl font-medium text-xs max-w-sm w-full transition-transform duration-300 translate-y-0 \${
          typeStyles[type]
        }\`}
      >
        <span className="font-bold">{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 font-bold ml-1">
          \u2715
        </button>
      </div>
    </div>,
    document.body,
  )
}
`;
}

// src/generators/templates/components/alertDialog.ts
function getAlertDialogTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface AlertDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
  darkMode?: boolean
}` : ""}

export default function AlertDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  darkMode = true,
}${isTs ? ": AlertDialogProps" : ""}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />

      {/* Dialog Card */}
      <div
        className={\`relative w-full max-w-xs rounded-3xl p-5 shadow-2xl border transition-all z-10 \${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }\`}
      >
        <h3 className="text-base font-bold text-center tracking-tight">{title}</h3>
        {description && (
          <p className={\`text-xs text-center mt-1.5 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
            {description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={\`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors \${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }\`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={\`py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-md transition-colors \${
              variant === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-blue-600 hover:bg-blue-500'
            }\`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/components/bottomSheet.ts
function getBottomSheetTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  darkMode?: boolean
}` : ""}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  darkMode = true,
}${isTs ? ": BottomSheetProps" : ""}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Sheet Content */}
      <div
        className={\`relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] border-t shadow-2xl z-10 transition-colors \${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }\`}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto mb-4 cursor-grab" onClick={onClose} />

        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
            <h3 className="text-base font-bold tracking-tight">{title}</h3>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
              \u2715
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/components/loadingSpinner.ts
function getLoadingSpinnerTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}` : ""}

export default function LoadingSpinner({
  size = 'md',
  label,
}${isTs ? ": LoadingSpinnerProps" : ""}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2.5',
    lg: 'w-10 h-10 border-3',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <div
        className={\`rounded-full border-cyan-500/30 border-t-cyan-400 animate-spin \${sizeClasses[size]}\`}
      />
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    </div>
  )
}
`;
}

// src/generators/templates/components/skeleton.ts
function getSkeletonTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  darkMode?: boolean
}` : ""}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  darkMode = true,
}${isTs ? ": SkeletonProps" : ""}) {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  }

  return (
    <div
      className={\`animate-pulse \${variantClasses[variant]} \${
        darkMode ? 'bg-slate-800/80' : 'bg-slate-200'
      } \${className}\`}
    />
  )
}
`;
}

// src/generators/templates/components/segmentedControl.ts
function getSegmentedControlTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface SegmentOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  darkMode?: boolean
}` : ""}

export default function SegmentedControl({
  options,
  value,
  onChange,
  darkMode = true,
}${isTs ? ": SegmentedControlProps" : ""}) {
  return (
    <div
      className={\`grid grid-flow-col auto-cols-fr p-1 rounded-2xl border transition-colors \${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }\`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={\`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 \${
              isSelected
                ? darkMode
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }\`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
`;
}

// src/generators/templates/components/pullToRefresh.ts
function getPullToRefreshTemplate(isTs) {
  return `import React, { useState, useRef } from 'react'

${isTs ? `export interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}` : ""}

export default function PullToRefresh({
  onRefresh,
  children,
}${isTs ? ": PullToRefreshProps" : ""}) {
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = (e${isTs ? ": React.TouchEvent" : ""}) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e${isTs ? ": React.TouchEvent" : ""}) => {
    if (startY.current > 0 && !isRefreshing && window.scrollY === 0) {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current
      if (diff > 0) {
        setPullY(Math.min(diff * 0.4, 70))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (pullY > 50 && !isRefreshing) {
      setIsRefreshing(true)
      setPullY(50)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullY(0)
        startY.current = 0
      }
    } else {
      setPullY(0)
      startY.current = 0
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pullY > 0 && (
        <div
          style={{ height: \`\${pullY}px\` }}
          className="flex items-center justify-center overflow-hidden transition-all text-xs text-cyan-400 font-semibold"
        >
          {isRefreshing ? 'Refreshing\u2026' : pullY > 50 ? 'Release to refresh' : 'Pull down to refresh'}
        </div>
      )}
      {children}
    </div>
  )
}
`;
}

// src/generators/templates/components/toggleSwitch.ts
function getToggleSwitchTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}` : ""}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}${isTs ? ": ToggleSwitchProps" : ""}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      {(label || description) && (
        <div>
          {label && <p className="font-medium text-sm">{label}</p>}
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={\`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer disabled:opacity-50 \${
          checked ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
        }\`}
      >
        <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform" />
      </button>
    </div>
  )
}
`;
}

// src/generators/templates/components/badge.ts
function getBadgeTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}` : ""}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}${isTs ? ": BadgeProps" : ""}) {
  const variantStyles = {
    primary: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
    success: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-600/20 border-amber-500/30 text-amber-400',
    danger: 'bg-rose-600/20 border-rose-500/30 text-rose-400',
    neutral: 'bg-slate-800 border-slate-700 text-slate-300',
  }

  return (
    <span
      className={\`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide \${
        variantStyles[variant]
      } \${className}\`}
    >
      {children}
    </span>
  )
}
`;
}

// src/generators/templates/views/homeView.ts
function getHomeViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import Badge from '../../components/badge'
import SegmentedControl from '../../components/segmentedControl'
import Skeleton from '../../components/skeleton'
import LoadingSpinner from '../../components/loadingSpinner'

${isTs ? `export interface HomeViewProps {
  count: number
  onIncrement: () => void
  onReset: () => void
  darkMode: boolean
  onOpenBottomSheet: () => void
  onShowToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void
  isLoadingAsync: boolean
  onTriggerReload: () => void
}` : ""}

export default function HomeView({
  count,
  onIncrement,
  onReset,
  darkMode,
  onOpenBottomSheet,
  onShowToast,
  isLoadingAsync,
  onTriggerReload,
}${isTs ? ": HomeViewProps" : ""}) {
  const [activeSegment, setActiveSegment] = useState${isTs ? "<string>" : ""}('overview')

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <section className="text-center pt-2">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
          <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">CapKit Mobile Starter</h2>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Badge variant="primary">React 19</Badge>
          <Badge variant="success">Capacitor 8</Badge>
          <Badge variant="warning">Tailwind v4</Badge>
        </div>
      </section>

      {/* Segmented Control */}
      <section>
        <SegmentedControl
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'interactive', label: 'Counter' },
            { value: 'async', label: 'Async Demo' },
          ]}
          value={activeSegment}
          onChange={setActiveSegment}
          darkMode={darkMode}
        />
      </section>

      {/* Segment 1: Overview */}
      {activeSegment === 'overview' && (
        <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <h3 className="font-semibold text-sm">Reusable Mobile System</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every component is built modularly under <code className="text-cyan-400">src/components/</code> following clean project structure conventions.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenBottomSheet}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
            >
              Open BottomSheet \u2197
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Pull-to-refresh enabled on top!', 'info')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
            >
              Test Pull-to-Refresh
            </button>
          </div>
        </div>
      )}

      {/* Segment 2: Interactive Counter */}
      {activeSegment === 'interactive' && (
        <div className={\`p-4 rounded-2xl border transition-colors flex items-center justify-between \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <div>
            <p className="font-semibold text-sm">State Counter</p>
            <p className="text-xs text-slate-400 mt-0.5">Taps: {count}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onIncrement}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
            >
              Increment ({count})
            </button>
            {count > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Segment 3: Async & Skeletons */}
      {activeSegment === 'async' && (
        <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Loading Skeletons Demo</span>
            <button
              type="button"
              onClick={onTriggerReload}
              className="text-xs text-cyan-400 font-semibold"
            >
              {isLoadingAsync ? 'Loading\u2026' : 'Trigger Reload'}
            </button>
          </div>
          {isLoadingAsync ? (
            <div className="space-y-2 py-2">
              <LoadingSpinner size="md" label="Fetching live device state\u2026" />
              <Skeleton className="h-4 w-3/4" darkMode={darkMode} />
              <Skeleton className="h-4 w-full" darkMode={darkMode} />
              <Skeleton className="h-12 w-full" darkMode={darkMode} />
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Tap "Trigger Reload" or pull down the page to see the skeleton loader and spinner in action.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
`;
}

// src/generators/templates/views/controlsView.ts
function getControlsViewTemplate(isTs) {
  return `import React from 'react'
import ToggleSwitch from '../../components/toggleSwitch'

${isTs ? `export interface ControlsViewProps {
  darkMode: boolean
  onToggleDarkMode: (val: boolean) => void
  hapticsEnabled: boolean
  onToggleHaptics: (val: boolean) => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
}` : ""}

export default function ControlsView({
  darkMode,
  onToggleDarkMode,
  hapticsEnabled,
  onToggleHaptics,
  onOpenBottomSheet,
  onOpenAlert,
}${isTs ? ": ControlsViewProps" : ""}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Device & App Settings
        </h3>
        <div className={\`p-4 rounded-2xl border divide-y transition-colors \${
          darkMode
            ? 'bg-slate-900 border-slate-800 divide-slate-800/80'
            : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
        }\`}>
          <ToggleSwitch
            label="Dark Mode"
            description="Switch between dark and light themes"
            checked={darkMode}
            onChange={onToggleDarkMode}
          />
          <div className="pt-2">
            <ToggleSwitch
              label="Haptics Vibration"
              description="Vibrate device on interactive feedback"
              checked={hapticsEnabled}
              onChange={onToggleHaptics}
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Modal & Sheet Triggers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open BottomSheet
          </button>
          <button
            type="button"
            onClick={onOpenAlert}
            className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Show Alert Dialog
          </button>
        </div>
      </section>
    </div>
  )
}
`;
}

// src/generators/templates/views/overlaysView.ts
function getOverlaysViewTemplate(isTs) {
  return `import React from 'react'

${isTs ? `export interface OverlaysViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
}` : ""}

export default function OverlaysView({
  onShowToast,
  onOpenBottomSheet,
  onOpenAlert,
}${isTs ? ": OverlaysViewProps" : ""}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Toast Notification Triggers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Success! Operation completed.', 'success')}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            \u2713 Success Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Error! Connection failed.', 'error')}
            className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            \u2715 Error Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Warning! Low battery detected.', 'warning')}
            className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            \u26A0 Warning Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Info: New update available.', 'info')}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            \u2139 Info Toast
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Modals & Sheets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open Sheet Modal
          </button>
          <button
            type="button"
            onClick={onOpenAlert}
            className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open Alert Modal
          </button>
        </div>
      </section>
    </div>
  )
}
`;
}

// src/generators/tailwindComponents.ts
async function generateTailwindComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path4.join(targetDir, "src", "components", folderName);
    await writeFile(path4.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path4.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path4.join(targetDir, "src", "views", folderName);
    await writeFile(path4.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path4.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getTabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getLoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getSkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getSegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getOverlaysViewTemplate(isTs));
}

// src/generators/templates/app.ts
function getAppTemplate(options, isTs) {
  return `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast${isTs ? ", { ToastType }" : ""} from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import PullToRefresh from './components/pullToRefresh'
import Badge from './components/badge'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? "<string>" : ""}('home')
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  const [darkMode, setDarkMode] = useState${isTs ? "<boolean>" : ""}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? "<boolean>" : ""}(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [isAlertOpen, setIsAlertOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [toastMessage, setToastMessage] = useState${isTs ? "<{ text: string; type: ToastType } | null>" : ""}(null)
  const [isLoadingAsync, setIsLoadingAsync] = useState${isTs ? "<boolean>" : ""}(false)

  ${options.android ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()` : `const platform = 'web'
  const isNative = false`}

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const showToast = (text${isTs ? ": string" : ""}, type${isTs ? ": ToastType" : ""} = 'info') => {
    setToastMessage({ text, type })
  }

  const handleRefresh = async () => {
    setIsLoadingAsync(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoadingAsync(false)
    showToast('Data refreshed successfully!', 'success')
  }

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      ),
    },
    {
      id: 'controls',
      label: 'Controls',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      badge: 2,
    },
    {
      id: 'overlays',
      label: 'Overlays',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        </svg>
      ),
    },
  ]

  const sidebarItems = [
    { id: '1', label: 'Dashboard', icon: '\u{1F4CA}', onClick: () => setActiveTab('home') },
    { id: '2', label: 'Component Suite', icon: '\u{1F9E9}', onClick: () => setActiveTab('controls') },
    { id: '3', label: 'Modal Overlays', icon: '\u{1F4F1}', onClick: () => setActiveTab('overlays') },
    { id: '4', label: 'Show Alert Dialog', icon: '\u26A0\uFE0F', onClick: () => setIsAlertOpen(true) },
  ]

  return (
    <div className={\`min-h-screen transition-colors duration-200 \${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }\`}>
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="CapKit Navigation"
        items={sidebarItems}
        darkMode={darkMode}
      />

      <AlertDialog
        isOpen={isAlertOpen}
        title="Reset State Counter?"
        description="This will reset your current taps counter back to 0."
        confirmText="Reset Now"
        variant="danger"
        onConfirm={() => {
          setCount(0)
          setIsAlertOpen(false)
          showToast('Counter reset to 0', 'warning')
        }}
        onCancel={() => setIsAlertOpen(false)}
        darkMode={darkMode}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="CapKit Mobile Components"
        darkMode={darkMode}
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-400">
            This draggable bottom sheet provides native mobile drawer experiences for menus, filters, and forms.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="primary">Header</Badge>
            <Badge variant="success">TabBar</Badge>
            <Badge variant="warning">Drawer</Badge>
            <Badge variant="danger">AlertDialog</Badge>
            <Badge variant="neutral">PullToRefresh</Badge>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsBottomSheetOpen(false)
              showToast('Action confirmed from BottomSheet', 'success')
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-md active:scale-98"
          >
            Confirm & Close
          </button>
        </div>
      </BottomSheet>

      <AppHeader
        title="${options.projectName}"
        subtitle="Mobile Component Suite"
        platform={platform}
        isNative={isNative}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-md mx-auto px-4 pb-24 pt-4 space-y-5">
          {activeTab === 'home' && (
            <HomeView
              count={count}
              onIncrement={() => {
                setCount((c) => c + 1)
                if ((count + 1) % 5 === 0) showToast(\`Reached \${count + 1} taps! \u{1F389}\`, 'success')
              }}
              onReset={() => setIsAlertOpen(true)}
              darkMode={darkMode}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onShowToast={showToast}
              isLoadingAsync={isLoadingAsync}
              onTriggerReload={handleRefresh}
            />
          )}

          {activeTab === 'controls' && (
            <ControlsView
              darkMode={darkMode}
              onToggleDarkMode={setDarkMode}
              hapticsEnabled={hapticsEnabled}
              onToggleHaptics={(val) => {
                setHapticsEnabled(val)
                showToast(val ? 'Haptics enabled' : 'Haptics disabled', 'info')
              }}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onOpenAlert={() => setIsAlertOpen(true)}
            />
          )}

          {activeTab === 'overlays' && (
            <OverlaysView
              onShowToast={showToast}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onOpenAlert={() => setIsAlertOpen(true)}
            />
          )}
        </main>
      </PullToRefresh>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
      />
    </div>
  )
}

export default App
`;
}

// src/generators/konstaComponents.ts
import path5 from "pathe";

// src/generators/templates/konsta/components/appNavbar.ts
function getKonstaNavbarTemplate(isTs) {
  return `import React from 'react'
import { Navbar, Badge } from 'konsta/react'

${isTs ? `export interface AppNavbarProps {
  title: string
  subtitle?: string
  platform?: string
  isNative?: boolean
  darkMode?: boolean
  onToggleTheme?: () => void
  onOpenSidebar?: () => void
}` : ""}

export default function AppNavbar({
  title,
  subtitle,
  platform = 'web',
  isNative = false,
  darkMode = true,
  onToggleTheme,
  onOpenSidebar,
}${isTs ? ": AppNavbarProps" : ""}) {
  return (
    <Navbar
      title={title}
      subtitle={subtitle}
      className="top-0 sticky"
      left={
        onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="p-1.5 ml-2 text-slate-400 hover:text-white"
            aria-label="Open Menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        ) : undefined
      }
      right={
        <div className="flex items-center gap-2 pr-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={\`p-1.5 rounded-full transition-colors \${
                darkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
              }\`}
              aria-label="Toggle Theme"
            >
              {darkMode ? '\u{1F319}' : '\u2600\uFE0F'}
            </button>
          )}
          <Badge colors={{ bg: isNative ? 'bg-emerald-500' : 'bg-blue-500' }}>
            {platform.toUpperCase()}
          </Badge>
        </div>
      }
    />
  )
}
`;
}

// src/generators/templates/konsta/components/tabBar.ts
function getKonstaTabBarTemplate(isTs) {
  return `import React from 'react'
import { Tabbar, TabbarLink, Badge } from 'konsta/react'

${isTs ? `export interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}

export interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
}` : ""}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
}${isTs ? ": TabBarProps" : ""}) {
  return (
    <Tabbar className="bottom-0 fixed left-0 right-0 z-30">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <TabbarLink
            key={tab.id}
            active={isActive}
            onClick={() => onTabChange(tab.id)}
            icon={
              <div className="relative">
                {tab.icon}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <Badge colors={{ bg: 'bg-rose-500' }} className="absolute -top-1 -right-2 text-[9px]">
                    {tab.badge}
                  </Badge>
                )}
              </div>
            }
            label={tab.label}
          />
        )
      })}
    </Tabbar>
  )
}
`;
}

// src/generators/templates/konsta/components/appSidebar.ts
function getKonstaSidebarTemplate(isTs) {
  return `import React from 'react'
import { Panel, Block, BlockTitle, List, ListItem, Button } from 'konsta/react'

${isTs ? `export interface SidebarItem {
  id: string
  label: string
  icon?: string
  onClick?: () => void
}

export interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  items: SidebarItem[]
  darkMode?: boolean
}` : ""}

export default function AppSidebar({
  isOpen,
  onClose,
  title = 'Menu',
  items,
  darkMode = true,
}${isTs ? ": AppSidebarProps" : ""}) {
  return (
    <Panel
      side="left"
      opened={isOpen}
      onBackdropClick={onClose}
      className={darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}
    >
      <div className="flex flex-col h-full justify-between p-4 pt-8">
        <div>
          <BlockTitle className="text-xl font-bold">{title}</BlockTitle>
          <List strong inset className={darkMode ? 'bg-slate-800' : 'bg-slate-100'}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.label}
                media={item.icon ? <span>{item.icon}</span> : undefined}
                link
                onClick={() => {
                  item.onClick?.()
                  onClose()
                }}
              />
            ))}
          </List>
        </div>

        <Block>
          <Button rounded onClick={onClose}>
            Close Menu
          </Button>
        </Block>
      </div>
    </Panel>
  )
}
`;
}

// src/generators/templates/konsta/components/toast.ts
function getKonstaToastTemplate(isTs) {
  return `import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Toast as KonstaToast, Button } from 'konsta/react'

${isTs ? `export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  opened: boolean
  text: string
  type?: ToastType
  onClose: () => void
  duration?: number
}` : ""}

export default function Toast({
  opened,
  text,
  onClose,
  duration = 3000,
}${isTs ? ": ToastProps" : ""}) {
  useEffect(() => {
    if (opened && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [opened, duration, onClose])

  if (!opened) return null

  return createPortal(
    <KonstaToast
      position="top"
      opened={opened}
      button={<Button rounded clear inline onClick={onClose}>\u2715</Button>}
      className="z-[9999]"
    >
      <div className="shrink">{text}</div>
    </KonstaToast>,
    document.body,
  )
}
`;
}

// src/generators/templates/konsta/components/alertDialog.ts
function getKonstaAlertDialogTemplate(isTs) {
  return `import React from 'react'
import { Dialog, DialogButton } from 'konsta/react'

${isTs ? `export interface AlertDialogProps {
  opened: boolean
  title: string
  content?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}` : ""}

export default function AlertDialog({
  opened,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}${isTs ? ": AlertDialogProps" : ""}) {
  return (
    <Dialog
      opened={opened}
      onBackdropClick={onCancel}
      title={title}
      content={content}
      className="z-[100]"
      buttons={
        <>
          <DialogButton onClick={onCancel}>{cancelText}</DialogButton>
          <DialogButton bold onClick={onConfirm}>{confirmText}</DialogButton>
        </>
      }
    />
  )
}
`;
}

// src/generators/templates/konsta/components/bottomSheet.ts
function getKonstaBottomSheetTemplate(isTs) {
  return `import React from 'react'
import { Sheet, Block, BlockTitle, Button } from 'konsta/react'

${isTs ? `export interface BottomSheetProps {
  opened: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  darkMode?: boolean
}` : ""}

export default function BottomSheet({
  opened,
  onClose,
  title,
  children,
  darkMode = true,
}${isTs ? ": BottomSheetProps" : ""}) {
  return (
    <Sheet
      opened={opened}
      onBackdropClick={onClose}
      className={\`rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-[100] shadow-2xl \${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}\`}
    >
      <div className="p-4">
        {title && <BlockTitle className="text-center font-bold text-base mb-2">{title}</BlockTitle>}
        <Block>{children}</Block>
        <div className="mt-4 px-4 pb-2">
          <Button rounded onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
`;
}

// src/generators/templates/konsta/components/loadingSpinner.ts
function getKonstaLoadingSpinnerTemplate(isTs) {
  return `import React from 'react'
import { Preloader } from 'konsta/react'

${isTs ? `export interface LoadingSpinnerProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}` : ""}

export default function LoadingSpinner({
  label,
}${isTs ? ": LoadingSpinnerProps" : ""}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <Preloader />
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    </div>
  )
}
`;
}

// src/generators/templates/konsta/components/segmentedControl.ts
function getKonstaSegmentedTemplate(isTs) {
  return `import React from 'react'
import { Segmented, SegmentedButton } from 'konsta/react'

${isTs ? `export interface SegmentOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (val: string) => void
}` : ""}

export default function SegmentedControl({
  options,
  value,
  onChange,
}${isTs ? ": SegmentedControlProps" : ""}) {
  return (
    <Segmented rounded strong>
      {options.map((opt) => (
        <SegmentedButton
          key={opt.value}
          active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </SegmentedButton>
      ))}
    </Segmented>
  )
}
`;
}

// src/generators/templates/konsta/views/homeView.ts
function getKonstaHomeViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import { Block, BlockTitle, Card, Button } from 'konsta/react'
import SegmentedControl from '../../components/segmentedControl'
import LoadingSpinner from '../../components/loadingSpinner'

${isTs ? `export interface HomeViewProps {
  count: number
  onIncrement: () => void
  onReset: () => void
  darkMode: boolean
  onOpenBottomSheet: () => void
  onShowToast: (msg: string) => void
  isLoadingAsync: boolean
  onTriggerReload: () => void
  isNative: boolean
}` : ""}

export default function HomeView({
  count,
  onIncrement,
  onReset,
  darkMode,
  onOpenBottomSheet,
  onShowToast,
  isLoadingAsync,
  onTriggerReload,
  isNative,
}${isTs ? ": HomeViewProps" : ""}) {
  const [activeSegment, setActiveSegment] = useState${isTs ? "<string>" : ""}('overview')

  return (
    <div className="space-y-4 pb-4">
      {/* Hero Section */}
      <Block className="text-center pt-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
          <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h2 className={\`text-2xl font-bold tracking-tight \${darkMode ? 'text-white' : 'text-slate-900'}\`}>
          Konsta UI Mobile Starter
        </h2>
        <p className={\`text-xs mt-1 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
          Konsta UI &bull; Tailwind CSS v4 &bull; Capacitor {isNative ? 'Native' : 'Web'}
        </p>
      </Block>

      {/* Segmented Tabs */}
      <Block className="my-2">
        <SegmentedControl
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'counter', label: 'Counter' },
            { value: 'async', label: 'Async Demo' },
          ]}
          value={activeSegment}
          onChange={setActiveSegment}
        />
      </Block>

      {/* Segment 1: Overview */}
      {activeSegment === 'overview' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="p-2 space-y-3">
            <h3 className="font-semibold text-sm">Pixel-Perfect Native UI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konsta UI automatically adapts styles to iOS and Material Design while integrating smoothly with Tailwind CSS v4.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button rounded onClick={onOpenBottomSheet}>
                Open Sheet Modal
              </Button>
              <Button rounded clear onClick={() => onShowToast('Toast notification triggered!')}>
                Show Toast
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Segment 2: Interactive Counter */}
      {activeSegment === 'counter' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="flex items-center justify-between p-2">
            <div>
              <p className={\`font-semibold text-sm \${darkMode ? 'text-slate-100' : 'text-slate-900'}\`}>
                State Counter
              </p>
              <p className={\`text-xs \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
                Taps: {count}
              </p>
            </div>
            <div className="flex gap-2">
              <Button rounded onClick={onIncrement}>
                Increment ({count})
              </Button>
              {count > 0 && (
                <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onReset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Segment 3: Async & Preloader */}
      {activeSegment === 'async' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="p-2 space-y-3 text-center">
            <h3 className="font-semibold text-sm">Async Preloader Demo</h3>
            {isLoadingAsync ? (
              <div className="py-4">
                <LoadingSpinner label="Fetching device data\u2026" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Tap below to test async loading state with Konsta Preloader.
                </p>
                <Button rounded onClick={onTriggerReload}>
                  Trigger Async Load
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
`;
}

// src/generators/templates/konsta/views/controlsView.ts
function getKonstaControlsViewTemplate(isTs) {
  return `import React from 'react'
import { BlockTitle, List, ListItem, Toggle, Button, Block } from 'konsta/react'

${isTs ? `export interface ControlsViewProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  hapticsEnabled: boolean
  onToggleHaptics: () => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
  platform: string
  isNative: boolean
}` : ""}

export default function ControlsView({
  darkMode,
  onToggleDarkMode,
  hapticsEnabled,
  onToggleHaptics,
  onOpenBottomSheet,
  onOpenAlert,
  platform,
  isNative,
}${isTs ? ": ControlsViewProps" : ""}) {
  return (
    <div className="space-y-4 pb-4">
      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Device & App Settings
      </BlockTitle>
      <List
        strong
        inset
        className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}
      >
        <ListItem
          title="Platform"
          after={platform.toUpperCase()}
          text={isNative ? 'Running on physical device' : 'Running in browser'}
        />
        <ListItem
          title="Dark Mode"
          text={darkMode ? 'Pure Dark theme active' : 'Clean Light theme active'}
          onClick={onToggleDarkMode}
          link
          after={<Toggle checked={darkMode} onChange={onToggleDarkMode} />}
        />
        <ListItem
          title="Haptics Feedback"
          text={hapticsEnabled ? 'Vibration enabled' : 'Disabled'}
          onClick={onToggleHaptics}
          link
          after={<Toggle checked={hapticsEnabled} onChange={onToggleHaptics} />}
        />
      </List>

      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Modals & Overlays
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={onOpenBottomSheet}>
          Open Sheet
        </Button>
        <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onOpenAlert}>
          Show Dialog
        </Button>
      </Block>
    </div>
  )
}
`;
}

// src/generators/templates/konsta/views/overlaysView.ts
function getKonstaOverlaysViewTemplate(isTs) {
  return `import React from 'react'
import { Block, BlockTitle, Button } from 'konsta/react'

${isTs ? `export interface OverlaysViewProps {
  onShowToast: (msg: string) => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
  darkMode: boolean
}` : ""}

export default function OverlaysView({
  onShowToast,
  onOpenBottomSheet,
  onOpenAlert,
  darkMode,
}${isTs ? ": OverlaysViewProps" : ""}) {
  return (
    <div className="space-y-4 pb-4">
      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Toast Notifications
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={() => onShowToast('Operation completed successfully!')}>
          Success Toast
        </Button>
        <Button rounded clear colors={{ text: 'text-amber-500' }} onClick={() => onShowToast('Warning: Check connection')}>
          Warning Toast
        </Button>
      </Block>

      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Modal Dialogs & Sheets
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={onOpenBottomSheet}>
          Bottom Sheet
        </Button>
        <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onOpenAlert}>
          Alert Dialog
        </Button>
      </Block>
    </div>
  )
}
`;
}

// src/generators/konstaComponents.ts
async function generateKonstaComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path5.join(targetDir, "src", "components", folderName);
    await writeFile(path5.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path5.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path5.join(targetDir, "src", "views", folderName);
    await writeFile(path5.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path5.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appNavbar", "AppNavbar", getKonstaNavbarTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getKonstaTabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getKonstaSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getKonstaToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getKonstaAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getKonstaBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getKonstaLoadingSpinnerTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getKonstaSegmentedTemplate(isTs));
  await writeView("homeView", "HomeView", getKonstaHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getKonstaControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getKonstaOverlaysViewTemplate(isTs));
}

// src/generators/templates/konsta/app.ts
function getKonstaAppTemplate(options, isTs) {
  return `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}
import { App as KonstaApp, Page } from 'konsta/react'
import AppNavbar from './components/appNavbar'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? "<string>" : ""}('home')
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  const [darkMode, setDarkMode] = useState${isTs ? "<boolean>" : ""}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? "<boolean>" : ""}(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [isAlertOpen, setIsAlertOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [toastText, setToastText] = useState${isTs ? "<string>" : ""}('')
  const [isToastOpen, setIsToastOpen] = useState${isTs ? "<boolean>" : ""}(false)
  const [isLoadingAsync, setIsLoadingAsync] = useState${isTs ? "<boolean>" : ""}(false)

  ${options.android ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()
  const theme = platform === 'ios' ? 'ios' : 'material'` : `const platform = 'web'
  const isNative = false
  const theme = 'material'`}

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark', 'k-dark')
    } else {
      document.documentElement.classList.remove('dark', 'k-dark')
    }
  }, [darkMode])

  const showToast = (text${isTs ? ": string" : ""}) => {
    setToastText(text)
    setIsToastOpen(true)
  }

  const handleRefresh = async () => {
    setIsLoadingAsync(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoadingAsync(false)
    showToast('Data refreshed successfully!')
  }

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      ),
    },
    {
      id: 'controls',
      label: 'Controls',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      badge: 1,
    },
    {
      id: 'overlays',
      label: 'Overlays',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        </svg>
      ),
    },
  ]

  const sidebarItems = [
    { id: '1', label: 'Home View', icon: '\u{1F3E0}', onClick: () => setActiveTab('home') },
    { id: '2', label: 'Controls View', icon: '\u2699\uFE0F', onClick: () => setActiveTab('controls') },
    { id: '3', label: 'Overlays View', icon: '\u{1F4F1}', onClick: () => setActiveTab('overlays') },
  ]

  return (
    <div className={darkMode ? 'dark k-dark' : ''}>
      <KonstaApp theme={theme} dark={darkMode} safeAreas className={darkMode ? 'dark k-dark' : ''}>
        <Page className={darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}>
          {/* Toast Notification */}
          <Toast
            opened={isToastOpen}
            text={toastText}
            onClose={() => setIsToastOpen(false)}
          />

          {/* Sidebar Drawer Panel */}
          <AppSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="CapKit Menu"
            items={sidebarItems}
            darkMode={darkMode}
          />

          {/* Alert Dialog */}
          <AlertDialog
            opened={isAlertOpen}
            title="Reset Counter"
            content="Are you sure you want to reset your taps count to 0?"
            confirmText="Reset"
            cancelText="Cancel"
            onConfirm={() => {
              setCount(0)
              setIsAlertOpen(false)
              showToast('Counter reset to 0')
            }}
            onCancel={() => setIsAlertOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <BottomSheet
            opened={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            title="Konsta UI Components"
            darkMode={darkMode}
          >
            <p className="text-xs text-slate-400 text-center py-2">
              Konsta UI Sheet modal with native animations and safe-area margins.
            </p>
          </BottomSheet>

          {/* Top Navbar */}
          <AppNavbar
            title="${options.projectName}"
            subtitle="Konsta UI + Tailwind"
            platform={platform}
            isNative={isNative}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />

          {/* Tab Views */}
          <main className="max-w-md mx-auto pb-20 pt-2 px-2">
            {activeTab === 'home' && (
              <HomeView
                count={count}
                onIncrement={() => {
                  setCount((c) => c + 1)
                  if ((count + 1) % 5 === 0) showToast(\`Reached \${count + 1} taps! \u{1F389}\`)
                }}
                onReset={() => setIsAlertOpen(true)}
                darkMode={darkMode}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onShowToast={showToast}
                isLoadingAsync={isLoadingAsync}
                onTriggerReload={handleRefresh}
                isNative={isNative}
              />
            )}

            {activeTab === 'controls' && (
              <ControlsView
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                hapticsEnabled={hapticsEnabled}
                onToggleHaptics={() => {
                  setHapticsEnabled(!hapticsEnabled)
                  showToast(!hapticsEnabled ? 'Haptics enabled' : 'Haptics disabled')
                }}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onOpenAlert={() => setIsAlertOpen(true)}
                platform={platform}
                isNative={isNative}
              />
            )}

            {activeTab === 'overlays' && (
              <OverlaysView
                onShowToast={showToast}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onOpenAlert={() => setIsAlertOpen(true)}
                darkMode={darkMode}
              />
            )}
          </main>

          {/* Bottom Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Page>
      </KonstaApp>
    </div>
  )
}

export default App
`;
}

// src/generators/daisyComponents.ts
import path6 from "pathe";

// src/generators/templates/daisy/components/appHeader.ts
function getDaisyAppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; onOpenSidebar: () => void; theme: string; onToggleTheme: () => void }" : "";
  return `import React from 'react'

export default function AppHeader({ title, onOpenSidebar, theme, onToggleTheme }${tsType}) {
  return (
    <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur border-b border-base-300 pt-[env(safe-area-inset-top)] px-4">
      <div className="navbar min-h-14 p-0">
        <div className="navbar-start">
          <button onClick={onOpenSidebar} className="btn btn-ghost btn-circle btn-sm" aria-label="Open Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="navbar-center">
          <span className="font-bold text-lg">{title}</span>
        </div>
        <div className="navbar-end">
          <button onClick={onToggleTheme} className="btn btn-ghost btn-circle btn-sm" aria-label="Toggle Theme">
            {theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}
          </button>
        </div>
      </div>
    </header>
  )
}
`;
}

// src/generators/templates/daisy/components/tabBar.ts
function getDaisyTabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '\u{1F3E0}' },
    { id: 'controls', label: 'Controls', icon: '\u{1F39B}\uFE0F' },
    { id: 'overlays', label: 'Overlays', icon: '\u2728', badge: badgeCount },
  ]

  return (
    <nav className="dock dock-bottom bg-base-100/90 backdrop-blur border-t border-base-300 pb-[env(safe-area-inset-bottom)] z-20">
      {tabs.map((tab) => {
        const active = currentTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={active ? 'dock-active text-primary' : 'text-base-content/70'}
          >
            <span className="text-lg relative">
              {tab.icon}
              {tab.badge ? (
                <span className="badge badge-xs badge-primary absolute -top-1 -right-2">
                  {tab.badge}
                </span>
              ) : null}
            </span>
            <span className="dock-label text-xs">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
`;
}

// src/generators/templates/daisy/components/appSidebar.ts
function getDaisyAppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Drawer Content */}
      <aside className="relative w-72 max-w-[80vw] bg-base-200 h-full p-4 flex flex-col shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 className="text-xl font-bold text-primary">CapKit Daisy</h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">\u2715</button>
        </div>

        <ul className="menu menu-md py-4 gap-1 flex-1">
          <li>
            <button onClick={() => { onSelectTab('home'); onClose(); }}>
              <span>\u{1F3E0}</span> Home Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => { onSelectTab('controls'); onClose(); }}>
              <span>\u{1F39B}\uFE0F</span> UI Controls
            </button>
          </li>
          <li>
            <button onClick={() => { onSelectTab('overlays'); onClose(); }}>
              <span>\u2728</span> Overlays & Feedback
            </button>
          </li>
        </ul>

        <div className="pt-4 border-t border-base-300 text-xs text-base-content/60 text-center">
          CapKit \u2022 Mobile Ready
        </div>
      </aside>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/toast.ts
function getDaisyToastTemplate(isTs) {
  const tsType = isTs ? ': { message: string; type?: "info" | "success" | "warning" | "error"; onClose: () => void }' : "";
  return `import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const alertClass = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  }[type]

  return (
    <div className="toast toast-top toast-center z-50 pt-[env(safe-area-inset-top)]">
      <div className={\`alert \${alertClass} shadow-lg text-sm flex items-center justify-between min-w-[280px]\`}>
        <span>{message}</span>
        <button onClick={onClose} className="btn btn-xs btn-ghost">\u2715</button>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/alertDialog.ts
function getDaisyAlertDialogTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }" : "";
  return `import React from 'react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  if (!isOpen) return null

  return (
    <dialog className="modal modal-open z-50">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/80 text-sm">{description}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onCancel}>
        <button>close</button>
      </form>
    </dialog>
  )
}
`;
}

// src/generators/templates/daisy/components/bottomSheet.ts
function getDaisyBottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full bg-base-100 rounded-t-3xl p-6 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-10 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">\u2715</button>
        </div>
        {children}
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/loadingSpinner.ts
function getDaisyLoadingSpinnerTemplate(isTs) {
  return `import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <span className="loading loading-spinner loading-md text-primary"></span>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/skeleton.ts
function getDaisySkeletonTemplate(isTs) {
  return `import React from 'react'

export default function Skeleton() {
  return (
    <div className="flex flex-col gap-3 w-full p-4">
      <div className="skeleton h-32 w-full rounded-2xl"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-3/4"></div>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/segmentedControl.ts
function getDaisySegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <div className="tabs tabs-box bg-base-200 p-1 rounded-xl w-full flex">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={\`tab flex-1 capitalize text-xs font-semibold \${selected === opt ? 'tab-active bg-primary text-primary-content' : ''}\`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/pullToRefresh.ts
function getDaisyPullToRefreshTemplate(isTs) {
  const tsType = isTs ? ": { onRefresh: () => Promise<void>; children: React.ReactNode }" : "";
  return `import React, { useState } from 'react'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-center py-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-xs btn-outline btn-primary gap-1"
        >
          {refreshing ? <span className="loading loading-spinner loading-xs" /> : '\u2193'} Pull to Refresh
        </button>
      </div>
      {children}
    </div>
  )
}
`;
}

// src/generators/templates/daisy/components/toggleSwitch.ts
function getDaisyToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <label className="label cursor-pointer justify-between py-2">
      {label && <span className="label-text font-medium">{label}</span>}
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}
`;
}

// src/generators/templates/daisy/components/badge.ts
function getDaisyBadgeTemplate(isTs) {
  const tsType = isTs ? ': { children: React.ReactNode; variant?: "primary" | "secondary" | "accent" | "neutral" }' : "";
  return `import React from 'react'

export default function Badge({ children, variant = 'primary' }${tsType}) {
  const variantClass = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    neutral: 'badge-neutral',
  }[variant]

  return <span className={\`badge \${variantClass} font-semibold\`}>{children}</span>
}
`;
}

// src/generators/templates/daisy/views/homeView.ts
function getDaisyHomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-primary">CapKit Daisy</h2>
            <Badge variant="primary">Mobile UI</Badge>
          </div>
          <p className="text-sm text-base-content/80">
            Tailwind CSS v4 + DaisyUI semantic components configured with safe-area insets.
          </p>
          <div className="card-actions justify-end mt-2">
            <button className="btn btn-primary btn-sm" onClick={onOpenSheet}>Open Action Sheet</button>
            <button className="btn btn-outline btn-sm" onClick={() => onShowToast('Hello from DaisyUI!')}>Toast</button>
          </div>
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/views/controlsView.ts
function getDaisyControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [notifications, setNotifications] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Segmented Tabs</h3>
          <SegmentedControl
            options={['daily', 'weekly', 'monthly']}
            selected={segment}
            onChange={setSegment}
          />
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Mobile Switches</h3>
          <ToggleSwitch label="Push Notifications" checked={notifications} onChange={setNotifications} />
          <div className="divider my-0" />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="primary">Active</Badge>
        <Badge variant="secondary">Pro</Badge>
        <Badge variant="accent">New</Badge>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/daisy/views/overlaysView.ts
function getDaisyOverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string, type?: any) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Feedback & Dialogs</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-error btn-sm" onClick={onShowAlert}>Show Alert</button>
            <button className="btn btn-success btn-sm" onClick={() => onShowToast('Operation successful!', 'success')}>Success Toast</button>
            <button className="btn btn-warning btn-sm" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning Toast</button>
            <button className="btn btn-primary btn-sm" onClick={onOpenSheet}>Bottom Sheet</button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="card-title text-sm">Loading Indicators</h3>
            <button className="btn btn-xs btn-ghost" onClick={() => setShowSkeleton(!showSkeleton)}>
              Toggle Skeleton
            </button>
          </div>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/daisyComponents.ts
async function generateDaisyComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path6.join(targetDir, "src", "components", folderName);
    await writeFile(path6.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path6.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path6.join(targetDir, "src", "views", folderName);
    await writeFile(path6.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path6.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getDaisyAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getDaisyTabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getDaisyAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getDaisyToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getDaisyAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getDaisyBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getDaisyLoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getDaisySkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getDaisySegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getDaisyPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getDaisyToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getDaisyBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getDaisyHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getDaisyControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getDaisyOverlaysViewTemplate(isTs));
}

// src/generators/templates/daisy/app.ts
function getDaisyAppTemplate(options, isTs) {
  return `import { useState } from 'react'
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' | 'error' } | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ message, type })
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content flex flex-col">
      {/* 1. Header */}
      <AppHeader
        title="${options.projectName}"
        onOpenSidebar={() => setSidebarOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Main Content Views */}
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'home' && (
          <HomeView
            onOpenSheet={() => setSheetOpen(true)}
            onShowToast={(msg) => showToast(msg, 'info')}
          />
        )}
        {currentTab === 'controls' && <ControlsView />}
        {currentTab === 'overlays' && (
          <OverlaysView
            onShowAlert={() => setAlertOpen(true)}
            onShowToast={showToast}
            onOpenSheet={() => setSheetOpen(true)}
          />
        )}
      </main>

      {/* 3. Bottom Navigation */}
      <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

      {/* 4. Overlays & Drawers */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTab={setCurrentTab}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={alertOpen}
        title="Confirm Action"
        description="Are you sure you want to proceed with this mobile operation?"
        onConfirm={() => {
          setAlertOpen(false)
          showToast('Action confirmed!', 'success')
        }}
        onCancel={() => setAlertOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Action Menu"
      >
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setSheetOpen(false)
              showToast('Item shared successfully!', 'success')
            }}
          >
            Share Content
          </button>
          <button
            className="btn btn-ghost btn-block"
            onClick={() => setSheetOpen(false)}
          >
            Cancel
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
`;
}

// src/generators/ionicComponents.ts
import path7 from "pathe";

// src/generators/templates/ionic/components/appHeader.ts
function getIonicAppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; onToggleTheme: () => void; isDark: boolean }" : "";
  return `import React from 'react'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/react'
import { moonOutline, sunnyOutline } from 'ionicons/icons'

export default function AppHeader({ title, onToggleTheme, isDark }${tsType}) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onToggleTheme}>
            <IonIcon slot="icon-only" icon={isDark ? sunnyOutline : moonOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
`;
}

// src/generators/templates/ionic/components/tabBar.ts
function getIonicTabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react'
import { homeOutline, optionsOutline, sparklesOutline } from 'ionicons/icons'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" selected={currentTab === 'home'} onClick={() => onChangeTab('home')}>
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="controls" selected={currentTab === 'controls'} onClick={() => onChangeTab('controls')}>
        <IonIcon icon={optionsOutline} />
        <IonLabel>Controls</IonLabel>
      </IonTabButton>

      <IonTabButton tab="overlays" selected={currentTab === 'overlays'} onClick={() => onChangeTab('overlays')}>
        <IonIcon icon={sparklesOutline} />
        <IonLabel>Overlays</IonLabel>
        {badgeCount > 0 && <IonBadge color="primary">{badgeCount}</IonBadge>}
      </IonTabButton>
    </IonTabBar>
  )
}
`;
}

// src/generators/templates/ionic/components/appSidebar.ts
function getIonicAppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, menuController } from '@ionic/react'
import { homeOutline, optionsOutline, sparklesOutline } from 'ionicons/icons'

export default function AppSidebar({ onSelectTab }${tsType}) {
  const handleSelect = async (tab: string) => {
    onSelectTab(tab)
    await menuController.close()
  }

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>CapKit Ionic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => handleSelect('home')}>
            <IonIcon slot="start" icon={homeOutline} />
            <IonLabel>Home Dashboard</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleSelect('controls')}>
            <IonIcon slot="start" icon={optionsOutline} />
            <IonLabel>UI Controls</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleSelect('overlays')}>
            <IonIcon slot="start" icon={sparklesOutline} />
            <IonLabel>Overlays & Dialogs</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}
`;
}

// src/generators/templates/ionic/components/toast.ts
function getIonicToastTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; message: string; color?: string; onDidDismiss: () => void }" : "";
  return `import React from 'react'
import { IonToast } from '@ionic/react'

export default function Toast({ isOpen, message, color = 'primary', onDidDismiss }${tsType}) {
  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      duration={3000}
      color={color}
      position="top"
      onDidDismiss={onDidDismiss}
    />
  )
}
`;
}

// src/generators/templates/ionic/components/alertDialog.ts
function getIonicAlertDialogTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }" : "";
  return `import React from 'react'
import { IonAlert } from '@ionic/react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <IonAlert
      isOpen={isOpen}
      header={title}
      message={description}
      buttons={[
        { text: 'Cancel', role: 'cancel', handler: onCancel },
        { text: 'Confirm', role: 'confirm', handler: onConfirm },
      ]}
      onDidDismiss={onCancel}
    />
  )
}
`;
}

// src/generators/templates/ionic/components/bottomSheet.ts
function getIonicBottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 0.9]}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {children}
      </IonContent>
    </IonModal>
  )
}
`;
}

// src/generators/templates/ionic/components/loadingSpinner.ts
function getIonicLoadingSpinnerTemplate(isTs) {
  return `import React from 'react'
import { IonSpinner } from '@ionic/react'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
      <IonSpinner name="crescent" color="primary" />
    </div>
  )
}
`;
}

// src/generators/templates/ionic/components/skeleton.ts
function getIonicSkeletonTemplate(isTs) {
  return `import React from 'react'
import { IonSkeletonText, IonCard, IonCardContent } from '@ionic/react'

export default function Skeleton() {
  return (
    <IonCard>
      <IonCardContent>
        <IonSkeletonText animated style={{ width: '60%', height: '24px', marginBottom: '8px' }} />
        <IonSkeletonText animated style={{ width: '100%', height: '16px', marginBottom: '4px' }} />
        <IonSkeletonText animated style={{ width: '80%', height: '16px' }} />
      </IonCardContent>
    </IonCard>
  )
}
`;
}

// src/generators/templates/ionic/components/segmentedControl.ts
function getIonicSegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <IonSegment value={selected} onIonChange={(e) => onChange(String(e.detail.value))}>
      {options.map((opt) => (
        <IonSegmentButton key={opt} value={opt}>
          <IonLabel style={{ textTransform: 'capitalize' }}>{opt}</IonLabel>
        </IonSegmentButton>
      ))}
    </IonSegment>
  )
}
`;
}

// src/generators/templates/ionic/components/pullToRefresh.ts
function getIonicPullToRefreshTemplate(isTs) {
  const tsType = isTs ? ": { onRefresh: () => Promise<void> }" : "";
  return `import React from 'react'
import { IonRefresher, IonRefresherContent } from '@ionic/react'

export default function PullToRefresh({ onRefresh }${tsType}) {
  const handleRefresh = async (event: CustomEvent) => {
    await onRefresh()
    event.detail.complete()
  }

  return (
    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
      <IonRefresherContent pullingText="Pull to refresh..." refreshingSpinner="circles" />
    </IonRefresher>
  )
}
`;
}

// src/generators/templates/ionic/components/toggleSwitch.ts
function getIonicToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'
import { IonItem, IonLabel, IonToggle } from '@ionic/react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <IonItem lines="full">
      {label && <IonLabel>{label}</IonLabel>}
      <IonToggle checked={checked} onIonChange={(e) => onChange(e.detail.checked)} />
    </IonItem>
  )
}
`;
}

// src/generators/templates/ionic/components/badge.ts
function getIonicBadgeTemplate(isTs) {
  const tsType = isTs ? ": { children: React.ReactNode; color?: string }" : "";
  return `import React from 'react'
import { IonChip, IonLabel } from '@ionic/react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return (
    <IonChip color={color}>
      <IonLabel>{children}</IonLabel>
    </IonChip>
  )
}
`;
}

// src/generators/templates/ionic/views/homeView.ts
function getIonicHomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle>CapKit Ionic</IonCardTitle>
            <Badge color="primary">Mobile UI</Badge>
          </div>
          <IonCardSubtitle>Cross-Platform Ionic React 8</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Full iOS & Android native-feel components with adaptive styling, gestures, and animations.
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <IonButton expand="block" size="small" onClick={onOpenSheet}>Action Sheet</IonButton>
            <IonButton expand="block" size="small" fill="outline" onClick={() => onShowToast('Hello from Ionic!')}>Toast</IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}
`;
}

// src/generators/templates/ionic/views/controlsView.ts
function getIonicControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList } from '@ionic/react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Segmented Tabs</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Mobile Switches</IonCardTitle>
        </IonCardHeader>
        <IonCardContent style={{ padding: 0 }}>
          <IonList>
            <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
            <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
          </IonList>
        </IonCardContent>
      </IonCard>

      <div style={{ display: 'flex', gap: '8px', padding: '0 8px' }}>
        <Badge color="success">Online</Badge>
        <Badge color="warning">Pending</Badge>
        <Badge color="tertiary">Pro</Badge>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/ionic/views/overlaysView.ts
function getIonicOverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string, color?: string) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Overlays & Dialogs</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <IonButton color="danger" size="small" onClick={onShowAlert}>Alert Dialog</IonButton>
            <IonButton color="success" size="small" onClick={() => onShowToast('Success notification!', 'success')}>Success</IonButton>
            <IonButton color="warning" size="small" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</IonButton>
            <IonButton color="primary" size="small" onClick={onOpenSheet}>Bottom Sheet</IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle>Loading States</IonCardTitle>
            <IonButton fill="clear" size="small" onClick={() => setShowSkeleton(!showSkeleton)}>
              Toggle
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </IonCardContent>
      </IonCard>
    </div>
  )
}
`;
}

// src/generators/ionicComponents.ts
async function generateIonicComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path7.join(targetDir, "src", "components", folderName);
    await writeFile(path7.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path7.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path7.join(targetDir, "src", "views", folderName);
    await writeFile(path7.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path7.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getIonicAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getIonicTabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getIonicAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getIonicToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getIonicAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getIonicBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getIonicLoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getIonicSkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getIonicSegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getIonicPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getIonicToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getIonicBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getIonicHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getIonicControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getIonicOverlaysViewTemplate(isTs));
}

// src/generators/templates/ionic/app.ts
function getIonicAppTemplate(options, isTs) {
  return `import { useState } from 'react'
import { IonApp, IonContent, setupIonicReact } from '@ionic/react'
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import PullToRefresh from './components/pullToRefresh'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

setupIonicReact({ mode: 'md' })

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; color?: string }>({ isOpen: false, message: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.body.classList.toggle('dark', !isDark)
  }

  const showToast = (message: string, color: string = 'primary') => {
    setToast({ isOpen: true, message, color })
  }

  return (
    <IonApp>
      <AppSidebar onSelectTab={setCurrentTab} />

      <div className="ion-page" id="main-content">
        <AppHeader
          title="${options.projectName}"
          onToggleTheme={toggleTheme}
          isDark={isDark}
        />

        <IonContent fullscreen>
          <PullToRefresh onRefresh={async () => {
            await new Promise((res) => setTimeout(res, 1500))
            showToast('Refreshed!', 'success')
          }} />

          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={(msg) => showToast(msg, 'primary')}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => setAlertOpen(true)}
              onShowToast={showToast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}
        </IonContent>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />
      </div>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        color={toast.color}
        onDidDismiss={() => setToast({ isOpen: false, message: '' })}
      />

      <AlertDialog
        isOpen={alertOpen}
        title="Confirm Operation"
        description="Are you sure you want to trigger this action in Ionic?"
        onConfirm={() => {
          setAlertOpen(false)
          showToast('Confirmed successfully!', 'success')
        }}
        onCancel={() => setAlertOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Ionic Action Sheet"
      >
        <p>This is a native Ionic bottom sheet modal with multiple snap points.</p>
      </BottomSheet>
    </IonApp>
  )
}
`;
}

// src/generators/herouiComponents.ts
import path8 from "pathe";

// src/generators/templates/heroui/components/appHeader.ts
function getHeroUIAppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }" : "";
  return `import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <Navbar className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] border-b border-divider" maxWidth="full">
      <NavbarContent justify="start">
        <Button isIconOnly variant="light" size="sm" onClick={onOpenSidebar} aria-label="Menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </NavbarContent>
      <NavbarBrand justify="center">
        <p className="font-bold text-inherit">{title}</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" size="sm" onClick={onToggleTheme} aria-label="Toggle theme">
            {isDark ? '\u2600\uFE0F' : '\u{1F319}'}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
`;
}

// src/generators/templates/heroui/components/tabBar.ts
function getHeroUITabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'
import { Badge } from '@heroui/react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '\u{1F3E0}' },
    { id: 'controls', label: 'Controls', icon: '\u{1F39B}\uFE0F' },
    { id: 'overlays', label: 'Overlays', icon: '\u2728', badge: badgeCount },
  ]

  return (
    <nav className="sticky bottom-0 z-20 flex justify-around items-center bg-background/80 backdrop-blur border-t border-divider py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {tabs.map((tab) => {
        const active = currentTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={\`flex flex-col items-center gap-1 transition-colors \${active ? 'text-primary font-semibold' : 'text-default-500'}\`}
          >
            <span className="text-xl relative">
              {tab.badge ? (
                <Badge content={tab.badge} color="primary" size="sm">
                  {tab.icon}
                </Badge>
              ) : (
                tab.icon
              )}
            </span>
            <span className="text-xs">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
`;
}

// src/generators/templates/heroui/components/appSidebar.ts
function getHeroUIAppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from '@heroui/react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="left" size="xs">
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
              <span className="text-primary font-bold">CapKit HeroUI</span>
            </DrawerHeader>
            <DrawerBody className="gap-2 py-4">
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('home'); onClose(); }}>
                \u{1F3E0} Home Dashboard
              </Button>
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('controls'); onClose(); }}>
                \u{1F39B}\uFE0F UI Controls
              </Button>
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('overlays'); onClose(); }}>
                \u2728 Overlays & Dialogs
              </Button>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
`;
}

// src/generators/templates/heroui/components/toast.ts
function getHeroUIToastTemplate(isTs) {
  const tsType = isTs ? ': { message: string; color?: "primary" | "success" | "warning" | "danger"; onClose: () => void }' : "";
  return `import React, { useEffect } from 'react'
import { Card, CardBody, Button } from '@heroui/react'

export default function Toast({ message, color = 'primary', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pt-[env(safe-area-inset-top)] w-11/12 max-w-sm">
      <Card className="shadow-lg border border-divider">
        <CardBody className="flex flex-row items-center justify-between py-2 px-3 gap-2">
          <span className="text-sm font-medium">{message}</span>
          <Button isIconOnly size="sm" variant="light" onClick={onClose}>\u2715</Button>
        </CardBody>
      </Card>
    </div>
  )
}
`;
}

// src/generators/templates/heroui/components/alertDialog.ts
function getHeroUIAlertDialogTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }" : "";
  return `import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onCancel} placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-default-600">{description}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCancel}>Cancel</Button>
              <Button color="primary" onPress={onConfirm}>Confirm</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
`;
}

// src/generators/templates/heroui/components/bottomSheet.ts
function getHeroUIBottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="bottom" size="md">
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        {() => (
          <>
            <DrawerHeader className="border-b border-divider">{title}</DrawerHeader>
            <DrawerBody className="py-4">{children}</DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
`;
}

// src/generators/templates/heroui/components/loadingSpinner.ts
function getHeroUILoadingSpinnerTemplate(isTs) {
  return `import React from 'react'
import { Spinner } from '@heroui/react'

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center p-4">
      <Spinner color="primary" />
    </div>
  )
}
`;
}

// src/generators/templates/heroui/components/skeleton.ts
function getHeroUISkeletonTemplate(isTs) {
  return `import React from 'react'
import { Card, Skeleton as HeroSkeleton } from '@heroui/react'

export default function Skeleton() {
  return (
    <Card className="w-full space-y-3 p-4" radius="lg">
      <HeroSkeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </HeroSkeleton>
      <div className="space-y-2">
        <HeroSkeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </HeroSkeleton>
        <HeroSkeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </HeroSkeleton>
      </div>
    </Card>
  )
}
`;
}

// src/generators/templates/heroui/components/segmentedControl.ts
function getHeroUISegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'
import { Tabs, Tab } from '@heroui/react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={(k) => onChange(String(k))}
      color="primary"
      fullWidth
    >
      {options.map((opt) => (
        <Tab key={opt} title={opt.charAt(0).toUpperCase() + opt.slice(1)} />
      ))}
    </Tabs>
  )
}
`;
}

// src/generators/templates/heroui/components/pullToRefresh.ts
function getHeroUIPullToRefreshTemplate(isTs) {
  const tsType = isTs ? ": { onRefresh: () => Promise<void>; children: React.ReactNode }" : "";
  return `import React, { useState } from 'react'
import { Button } from '@heroui/react'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div>
      <div className="flex justify-center py-2">
        <Button size="sm" variant="flat" color="primary" isLoading={refreshing} onClick={handleRefresh}>
          Pull to Refresh
        </Button>
      </div>
      {children}
    </div>
  )
}
`;
}

// src/generators/templates/heroui/components/toggleSwitch.ts
function getHeroUIToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'
import { Switch } from '@heroui/react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <div className="flex items-center justify-between py-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <Switch isSelected={checked} onValueChange={onChange} color="primary" />
    </div>
  )
}
`;
}

// src/generators/templates/heroui/components/badge.ts
function getHeroUIBadgeTemplate(isTs) {
  const tsType = isTs ? ': { children: React.ReactNode; color?: "primary" | "secondary" | "success" | "warning" | "danger" }' : "";
  return `import React from 'react'
import { Chip } from '@heroui/react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <Chip color={color} size="sm" variant="flat">{children}</Chip>
}
`;
}

// src/generators/templates/heroui/views/homeView.ts
function getHeroUIHomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="flex justify-between items-center pb-2">
          <h2 className="font-bold text-lg text-primary">CapKit HeroUI</h2>
          <Badge color="primary">Mobile UI</Badge>
        </CardHeader>
        <CardBody className="py-2 text-sm text-default-600">
          Tailwind CSS v4 + HeroUI with Framer Motion micro-animations, theme tokens, and safe areas.
        </CardBody>
        <CardFooter className="gap-2">
          <Button size="sm" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
          <Button size="sm" variant="bordered" onClick={() => onShowToast('Hello from HeroUI!')}>Show Toast</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
`;
}

// src/generators/templates/heroui/views/controlsView.ts
function getHeroUIControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Segmented Tabs</CardHeader>
        <CardBody>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Mobile Switches</CardHeader>
        <CardBody className="divide-y divide-divider">
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Badge color="success">Active</Badge>
        <Badge color="secondary">Pro</Badge>
        <Badge color="warning">Pending</Badge>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/heroui/views/overlaysView.ts
function getHeroUIOverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string, color?: any) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Button } from '@heroui/react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Feedback & Dialogs</CardHeader>
        <CardBody className="grid grid-cols-2 gap-2">
          <Button size="sm" color="danger" onClick={onShowAlert}>Alert Modal</Button>
          <Button size="sm" color="success" onClick={() => onShowToast('Operation succeeded!', 'success')}>Success</Button>
          <Button size="sm" color="warning" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</Button>
          <Button size="sm" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardHeader className="flex justify-between items-center">
          <span className="font-semibold text-sm">Loading States</span>
          <Button size="sm" variant="light" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle</Button>
        </CardHeader>
        <CardBody>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </CardBody>
      </Card>
    </div>
  )
}
`;
}

// src/generators/herouiComponents.ts
async function generateHeroUIComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path8.join(targetDir, "src", "components", folderName);
    await writeFile(path8.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path8.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path8.join(targetDir, "src", "views", folderName);
    await writeFile(path8.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path8.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getHeroUIAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getHeroUITabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getHeroUIAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getHeroUIToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getHeroUIAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getHeroUIBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getHeroUILoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getHeroUISkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getHeroUISegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getHeroUIPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getHeroUIToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getHeroUIBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getHeroUIHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getHeroUIControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getHeroUIOverlaysViewTemplate(isTs));
}

// src/generators/templates/heroui/app.ts
function getHeroUIAppTemplate(options, isTs) {
  return `import { useState } from 'react'
import { HeroUIProvider } from '@heroui/react'
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; color?: 'primary' | 'success' | 'warning' | 'danger' } | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const showToast = (message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'primary') => {
    setToast({ message, color })
  }

  return (
    <HeroUIProvider>
      <div className={\`\${isDark ? 'dark' : ''} text-foreground bg-background min-h-screen flex flex-col\`}>
        <AppHeader
          title="${options.projectName}"
          onOpenSidebar={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={(msg) => showToast(msg, 'primary')}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => setAlertOpen(true)}
              onShowToast={showToast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}
        </main>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTab={setCurrentTab}
        />

        {toast && (
          <Toast
            message={toast.message}
            color={toast.color}
            onClose={() => setToast(null)}
          />
        )}

        <AlertDialog
          isOpen={alertOpen}
          title="Confirm Action"
          description="Are you sure you want to proceed with HeroUI modal action?"
          onConfirm={() => {
            setAlertOpen(false)
            showToast('Confirmed!', 'success')
          }}
          onCancel={() => setAlertOpen(false)}
        />

        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="HeroUI Actions"
        >
          <p className="text-sm text-default-600">HeroUI Bottom Sheet with fluid gesture animation.</p>
        </BottomSheet>
      </div>
    </HeroUIProvider>
  )
}
`;
}

// src/generators/muiComponents.ts
import path9 from "pathe";

// src/generators/templates/mui/components/appHeader.ts
function getMUIAppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }" : "";
  return `import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <AppBar position="sticky" sx={{ pt: 'env(safe-area-inset-top)', zIndex: 1100 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onOpenSidebar} sx={{ mr: 2 }}>
          <span style={{ fontSize: '20px' }}>\u2630</span>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton color="inherit" onClick={onToggleTheme} aria-label="toggle theme">
          <span>{isDark ? '\u2600\uFE0F' : '\u{1F319}'}</span>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
`;
}

// src/generators/templates/mui/components/tabBar.ts
function getMUITabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, pb: 'env(safe-area-inset-bottom)', zIndex: 1000 }} elevation={4}>
      <BottomNavigation
        showLabels
        value={currentTab}
        onChange={(_, newValue) => onChangeTab(newValue)}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<span style={{ fontSize: '20px' }}>\u{1F3E0}</span>}
        />
        <BottomNavigationAction
          label="Controls"
          value="controls"
          icon={<span style={{ fontSize: '20px' }}>\u{1F39B}\uFE0F</span>}
        />
        <BottomNavigationAction
          label="Overlays"
          value="overlays"
          icon={
            <Badge badgeContent={badgeCount} color="primary">
              <span style={{ fontSize: '20px' }}>\u2728</span>
            </Badge>
          }
        />
      </BottomNavigation>
    </Paper>
  )
}
`;
}

// src/generators/templates/mui/components/appSidebar.ts
function getMUIAppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 260 }} role="presentation">
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6" fontWeight="bold">CapKit MUI</Typography>
          <Typography variant="caption">Material Design 3</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('home'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>\u{1F3E0}</span></ListItemIcon>
              <ListItemText primary="Home Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('controls'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>\u{1F39B}\uFE0F</span></ListItemIcon>
              <ListItemText primary="UI Controls" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('overlays'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>\u2728</span></ListItemIcon>
              <ListItemText primary="Overlays & Dialogs" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
`;
}

// src/generators/templates/mui/components/toast.ts
function getMUIToastTemplate(isTs) {
  const tsType = isTs ? ': { open: boolean; message: string; severity?: "info" | "success" | "warning" | "error"; onClose: () => void }' : "";
  return `import React from 'react'
import { Snackbar, Alert } from '@mui/material'

export default function Toast({ open, message, severity = 'info', onClose }${tsType}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ pt: 'env(safe-area-inset-top)' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
`;
}

// src/generators/templates/mui/components/alertDialog.ts
function getMUIAlertDialogTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }" : "";
  return `import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
`;
}

// src/generators/templates/mui/components/bottomSheet.ts
function getMUIBottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'
import { Drawer, Box, Typography, IconButton } from '@mui/material'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 'calc(1rem + env(safe-area-inset-bottom))' } }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ width: 40, height: 4, bgcolor: 'grey.400', borderRadius: 2, mx: 'auto', mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton size="small" onClick={onClose}>\u2715</IconButton>
        </Box>
        {children}
      </Box>
    </Drawer>
  )
}
`;
}

// src/generators/templates/mui/components/loadingSpinner.ts
function getMUILoadingSpinnerTemplate(isTs) {
  return `import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CircularProgress />
    </Box>
  )
}
`;
}

// src/generators/templates/mui/components/skeleton.ts
function getMUISkeletonTemplate(isTs) {
  return `import React from 'react'
import { Box, Skeleton as MUISkeleton } from '@mui/material'

export default function Skeleton() {
  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <MUISkeleton variant="rectangular" width="100%" height={118} sx={{ borderRadius: 2, mb: 1 }} />
      <MUISkeleton width="60%" height={24} />
      <MUISkeleton width="80%" height={20} />
    </Box>
  )
}
`;
}

// src/generators/templates/mui/components/segmentedControl.ts
function getMUISegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      fullWidth
      size="small"
    >
      {options.map((opt) => (
        <ToggleButton key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>
          {opt}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
`;
}

// src/generators/templates/mui/components/pullToRefresh.ts
function getMUIPullToRefreshTemplate(isTs) {
  const tsType = isTs ? ": { onRefresh: () => Promise<void>; children: React.ReactNode }" : "";
  return `import React, { useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Button size="small" variant="outlined" disabled={refreshing} onClick={handleRefresh}>
          {refreshing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : '\u2193 '} Pull to Refresh
        </Button>
      </Box>
      {children}
    </Box>
  )
}
`;
}

// src/generators/templates/mui/components/toggleSwitch.ts
function getMUIToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'
import { FormControlLabel, Switch, Box } from '@mui/material'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
        label={label || ''}
        sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
      />
    </Box>
  )
}
`;
}

// src/generators/templates/mui/components/badge.ts
function getMUIBadgeTemplate(isTs) {
  const tsType = isTs ? ': { children: React.ReactNode; color?: "primary" | "secondary" | "success" | "warning" | "error" }' : "";
  return `import React from 'react'
import { Chip } from '@mui/material'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <Chip label={children} color={color} size="small" />
}
`;
}

// src/generators/templates/mui/views/homeView.ts
function getMUIHomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import { Card, CardHeader, CardContent, CardActions, Typography, Button, Box } from '@mui/material'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader
          title="CapKit Material UI"
          subheader="Google Material Design 3"
          action={<Badge color="primary">Mobile UI</Badge>}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Production-grade Material UI v7 components tailored for mobile touch screens and safe-area insets.
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button size="small" variant="contained" onClick={onOpenSheet}>Action Sheet</Button>
          <Button size="small" variant="outlined" onClick={() => onShowToast('Hello from MUI!')}>Toast</Button>
        </CardActions>
      </Card>
    </Box>
  )
}
`;
}

// src/generators/templates/mui/views/controlsView.ts
function getMUIControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Box, Divider } from '@mui/material'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader title="Segmented Tabs" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardHeader title="Mobile Switches" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent>
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <Divider sx={{ my: 1 }} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Badge color="success">Active</Badge>
        <Badge color="secondary">Pro</Badge>
        <Badge color="warning">Pending</Badge>
      </Box>
    </Box>
  )
}
`;
}

// src/generators/templates/mui/views/overlaysView.ts
function getMUIOverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string, severity?: any) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Box } from '@mui/material'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader title="Feedback & Dialogs" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Button size="small" variant="contained" color="error" onClick={onShowAlert}>Alert Dialog</Button>
          <Button size="small" variant="contained" color="success" onClick={() => onShowToast('Operation succeeded!', 'success')}>Success</Button>
          <Button size="small" variant="contained" color="warning" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</Button>
          <Button size="small" variant="contained" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardHeader
          title="Loading States"
          titleTypographyProps={{ variant: 'subtitle2' }}
          action={<Button size="small" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle</Button>}
        />
        <CardContent>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </CardContent>
      </Card>
    </Box>
  )
}
`;
}

// src/generators/muiComponents.ts
async function generateMUIComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path9.join(targetDir, "src", "components", folderName);
    await writeFile(path9.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path9.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path9.join(targetDir, "src", "views", folderName);
    await writeFile(path9.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path9.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getMUIAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getMUITabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getMUIAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getMUIToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getMUIAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getMUIBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getMUILoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getMUISkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getMUISegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getMUIPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getMUIToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getMUIBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getMUIHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getMUIControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getMUIOverlaysViewTemplate(isTs));
}

// src/generators/templates/mui/app.ts
function getMUIAppTemplate(options, isTs) {
  return `import { useState, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material'
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [currentTab, setCurrentTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'info' | 'success' | 'warning' | 'error' }>({ open: false, message: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#3b82f6' },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
      }),
    [mode]
  )

  const showToast = (message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ open: true, message, severity })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <AppHeader
          title="${options.projectName}"
          onOpenSidebar={() => setSidebarOpen(true)}
          isDark={mode === 'dark'}
          onToggleTheme={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <Box component="main" sx={{ flexGrow: 1, pb: 10, overflowY: 'auto' }}>
          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={(msg) => showToast(msg, 'info')}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => setAlertOpen(true)}
              onShowToast={showToast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}
        </Box>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTab={setCurrentTab}
        />

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        />

        <AlertDialog
          isOpen={alertOpen}
          title="Confirm Action"
          description="Are you sure you want to perform this Material UI operation?"
          onConfirm={() => {
            setAlertOpen(false)
            showToast('Confirmed successfully!', 'success')
          }}
          onCancel={() => setAlertOpen(false)}
        />

        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Material Actions"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <button
              style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => {
                setSheetOpen(false)
                showToast('Shared successfully!', 'success')
              }}
            >
              Share Item
            </button>
          </Box>
        </BottomSheet>
      </Box>
    </ThemeProvider>
  )
}
`;
}

// src/generators/framework7Components.ts
import path10 from "pathe";

// src/generators/templates/framework7/components/appHeader.ts
function getFramework7AppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; isDark: boolean; onToggleTheme: () => void }" : "";
  return `import React from 'react'
import { Navbar, NavLeft, NavTitle, NavRight, Link } from 'framework7-react'

export default function AppHeader({ title, isDark, onToggleTheme }${tsType}) {
  return (
    <Navbar>
      <NavLeft>
        <Link panelOpen="left" iconF7="bars" />
      </NavLeft>
      <NavTitle>{title}</NavTitle>
      <NavRight>
        <Link onClick={onToggleTheme}>
          {isDark ? '\u2600\uFE0F' : '\u{1F319}'}
        </Link>
      </NavRight>
    </Navbar>
  )
}
`;
}

// src/generators/templates/framework7/components/tabBar.ts
function getFramework7TabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'
import { Toolbar, Link, Badge } from 'framework7-react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <Toolbar bottom tabbar icons>
      <Link tabLink="#view-home" tabLinkActive={currentTab === 'home'} onClick={() => onChangeTab('home')} text="Home" iconF7="house" />
      <Link tabLink="#view-controls" tabLinkActive={currentTab === 'controls'} onClick={() => onChangeTab('controls')} text="Controls" iconF7="slider_horizontal_3" />
      <Link tabLink="#view-overlays" tabLinkActive={currentTab === 'overlays'} onClick={() => onChangeTab('overlays')} text="Overlays" iconF7="sparkles" badge={badgeCount > 0 ? String(badgeCount) : undefined} badgeColor="red" />
    </Toolbar>
  )
}
`;
}

// src/generators/templates/framework7/components/appSidebar.ts
function getFramework7AppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'
import { Panel, Page, Navbar, List, ListItem } from 'framework7-react'

export default function AppSidebar({ onSelectTab }${tsType}) {
  return (
    <Panel left cover>
      <Page>
        <Navbar title="CapKit Framework7" />
        <List menuList>
          <ListItem link title="Home Dashboard" panelClose onClick={() => onSelectTab('home')} />
          <ListItem link title="UI Controls" panelClose onClick={() => onSelectTab('controls')} />
          <ListItem link title="Overlays & Dialogs" panelClose onClick={() => onSelectTab('overlays')} />
        </List>
      </Page>
    </Panel>
  )
}
`;
}

// src/generators/templates/framework7/components/toast.ts
function getFramework7ToastTemplate(isTs) {
  return `import React from 'react'
import { f7 } from 'framework7-react'

export function showFramework7Toast(text: string) {
  if (f7) {
    f7.toast.create({
      text,
      position: 'top',
      closeTimeout: 3000,
    }).open()
  }
}

export default function Toast() {
  return null
}
`;
}

// src/generators/templates/framework7/components/alertDialog.ts
function getFramework7AlertDialogTemplate(isTs) {
  return `import React from 'react'
import { f7 } from 'framework7-react'

export function showFramework7Alert(title: string, text: string, onConfirm?: () => void) {
  if (f7) {
    f7.dialog.confirm(text, title, onConfirm)
  }
}

export default function AlertDialog() {
  return null
}
`;
}

// src/generators/templates/framework7/components/bottomSheet.ts
function getFramework7BottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { opened: boolean; onBackdropClick: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'
import { Sheet, PageContent, BlockTitle, Block } from 'framework7-react'

export default function BottomSheet({ opened, onBackdropClick, title, children }${tsType}) {
  return (
    <Sheet opened={opened} onSheetClosed={onBackdropClick} swipeToClose backdrop style={{ height: 'auto', maxHeight: '70vh' }}>
      <PageContent>
        <BlockTitle large>{title}</BlockTitle>
        <Block>{children}</Block>
      </PageContent>
    </Sheet>
  )
}
`;
}

// src/generators/templates/framework7/components/loadingSpinner.ts
function getFramework7LoadingSpinnerTemplate(isTs) {
  return `import React from 'react'
import { Preloader, Block } from 'framework7-react'

export default function LoadingSpinner() {
  return (
    <Block className="text-align-center">
      <Preloader color="primary" />
    </Block>
  )
}
`;
}

// src/generators/templates/framework7/components/skeleton.ts
function getFramework7SkeletonTemplate(isTs) {
  return `import React from 'react'
import { Card, CardContent, SkeletonBlock } from 'framework7-react'

export default function Skeleton() {
  return (
    <Card>
      <CardContent>
        <SkeletonBlock style={{ height: '100px', marginBottom: '8px' }} />
        <SkeletonBlock style={{ height: '16px', width: '60%', marginBottom: '4px' }} />
        <SkeletonBlock style={{ height: '16px', width: '80%' }} />
      </CardContent>
    </Card>
  )
}
`;
}

// src/generators/templates/framework7/components/segmentedControl.ts
function getFramework7SegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'
import { Segmented, Button } from 'framework7-react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <Segmented round raised>
      {options.map((opt) => (
        <Button key={opt} active={selected === opt} onClick={() => onChange(opt)}>
          {opt}
        </Button>
      ))}
    </Segmented>
  )
}
`;
}

// src/generators/templates/framework7/components/pullToRefresh.ts
function getFramework7PullToRefreshTemplate(isTs) {
  return `import React from 'react'

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
`;
}

// src/generators/templates/framework7/components/toggleSwitch.ts
function getFramework7ToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'
import { ListItem, Toggle } from 'framework7-react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <ListItem title={label}>
      <Toggle checked={checked} onToggleChange={onChange} slot="after" color="primary" />
    </ListItem>
  )
}
`;
}

// src/generators/templates/framework7/components/badge.ts
function getFramework7BadgeTemplate(isTs) {
  const tsType = isTs ? ": { children: React.ReactNode; color?: string }" : "";
  return `import React from 'react'
import { Badge as F7Badge } from 'framework7-react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <F7Badge color={color}>{children}</F7Badge>
}
`;
}

// src/generators/templates/framework7/views/homeView.ts
function getFramework7HomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import { Card, CardHeader, CardContent, CardFooter, Button, Block } from 'framework7-react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <Block>
      <Card>
        <CardHeader className="display-flex justify-content-space-between align-items-center">
          <span>CapKit Framework7</span>
          <Badge color="blue">Mobile UI</Badge>
        </CardHeader>
        <CardContent>
          Framework7 native mobile UI engine with built-in iOS & Material Design themes, touch transitions, and safe areas.
        </CardContent>
        <CardFooter>
          <Button fill small onClick={onOpenSheet}>Action Sheet</Button>
          <Button outline small onClick={() => onShowToast('Hello from Framework7!')}>Toast</Button>
        </CardFooter>
      </Card>
    </Block>
  )
}
`;
}

// src/generators/templates/framework7/views/controlsView.ts
function getFramework7ControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import { Block, BlockTitle, Card, CardContent, List } from 'framework7-react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <Block>
      <BlockTitle>Segmented Tabs</BlockTitle>
      <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />

      <BlockTitle>Mobile Switches</BlockTitle>
      <Card>
        <List noHairlines>
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </List>
      </Card>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Badge color="green">Active</Badge>
        <Badge color="orange">Pending</Badge>
        <Badge color="blue">Pro</Badge>
      </div>
    </Block>
  )
}
`;
}

// src/generators/templates/framework7/views/overlaysView.ts
function getFramework7OverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import { Block, Card, CardHeader, CardContent, Button, Row, Col } from 'framework7-react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <Block>
      <Card>
        <CardHeader>Feedback & Dialogs</CardHeader>
        <CardContent>
          <Row>
            <Col><Button fill color="red" small onClick={onShowAlert}>Alert</Button></Col>
            <Col><Button fill color="green" small onClick={() => onShowToast('Success notification!')}>Toast</Button></Col>
          </Row>
          <Row style={{ marginTop: '8px' }}>
            <Col><Button fill color="blue" small onClick={onOpenSheet}>Bottom Sheet</Button></Col>
            <Col><Button outline small onClick={() => setShowSkeleton(!showSkeleton)}>Toggle Skeleton</Button></Col>
          </Row>
        </CardContent>
      </Card>

      {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
    </Block>
  )
}
`;
}

// src/generators/framework7Components.ts
async function generateFramework7Components(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path10.join(targetDir, "src", "components", folderName);
    await writeFile(path10.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path10.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path10.join(targetDir, "src", "views", folderName);
    await writeFile(path10.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path10.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getFramework7AppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getFramework7TabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getFramework7AppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getFramework7ToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getFramework7AlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getFramework7BottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getFramework7LoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getFramework7SkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getFramework7SegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getFramework7PullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getFramework7ToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getFramework7BadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getFramework7HomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getFramework7ControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getFramework7OverlaysViewTemplate(isTs));
}

// src/generators/templates/framework7/app.ts
function getFramework7AppTemplate(options, isTs) {
  return `import { useState } from 'react'
import Framework7 from 'framework7/lite-bundle'
import Framework7React, { App, View, Page } from 'framework7-react'
import 'framework7/css/bundle'

import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import BottomSheet from './components/bottomSheet'
import { showFramework7Toast } from './components/toast'
import { showFramework7Alert } from './components/alertDialog'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

Framework7.use(Framework7React)

export default function MainApp() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark', !isDark)
  }

  return (
    <App theme="auto" name="${options.projectName}" dark={isDark}>
      <AppSidebar onSelectTab={setCurrentTab} />

      <View main className="safe-areas">
        <Page ptr onPtrRefresh={(done) => {
          setTimeout(() => {
            showFramework7Toast('Refreshed!')
            done()
          }, 1500)
        }}>
          <AppHeader
            title="${options.projectName}"
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={showFramework7Toast}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => showFramework7Alert('Confirm Action', 'Are you sure you want to proceed in Framework7?')}
              onShowToast={showFramework7Toast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}

          <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />
        </Page>
      </View>

      <BottomSheet
        opened={sheetOpen}
        onBackdropClick={() => setSheetOpen(false)}
        title="Framework7 Action Sheet"
      >
        <p>Native iOS and Material Design action modal.</p>
      </BottomSheet>
    </App>
  )
}
`;
}

// src/generators/vanillaComponents.ts
import path11 from "pathe";

// src/generators/templates/vanilla/components/appHeader.ts
function getVanillaAppHeaderTemplate(isTs) {
  const tsType = isTs ? ": { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }" : "";
  return `import React from 'react'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #334155',
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: '16px',
      paddingRight: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <button
          onClick={onOpenSidebar}
          style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '20px', cursor: 'pointer', padding: '8px' }}
          aria-label="Open menu"
        >
          \u2630
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{title}</span>
        <button
          onClick={onToggleTheme}
          style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '18px', cursor: 'pointer', padding: '8px' }}
          aria-label="Toggle theme"
        >
          {isDark ? '\u2600\uFE0F' : '\u{1F319}'}
        </button>
      </div>
    </header>
  )
}
`;
}

// src/generators/templates/vanilla/components/tabBar.ts
function getVanillaTabBarTemplate(isTs) {
  const tsType = isTs ? ": { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }" : "";
  return `import React from 'react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '\u{1F3E0}' },
    { id: 'controls', label: 'Controls', icon: '\u{1F39B}\uFE0F' },
    { id: 'overlays', label: 'Overlays', icon: '\u2728', badge: badgeCount },
  ]

  return (
    <nav style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid #334155',
      paddingTop: '8px',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
    }}>
      {tabs.map((tab) => {
        const active = currentTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: active ? '#38bdf8' : '#94a3b8',
              fontWeight: active ? 'bold' : 'normal',
              cursor: 'pointer',
              gap: '2px',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {tab.icon}
              {tab.badge ? (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '4px',
                  background: '#38bdf8',
                  color: '#0f172a',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  padding: '2px 6px',
                  fontWeight: 'bold',
                }}>
                  {tab.badge}
                </span>
              ) : null}
            </span>
            <span style={{ fontSize: '11px' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
`;
}

// src/generators/templates/vanilla/components/appSidebar.ts
function getVanillaAppSidebarTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }" : "";
  return `import React from 'react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      <aside style={{
        position: 'relative',
        width: '280px',
        maxWidth: '80vw',
        background: '#1e293b',
        color: '#f8fafc',
        height: '100%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>CapKit App</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>\u2715</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', flex: 1 }}>
          <button onClick={() => { onSelectTab('home'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>\u{1F3E0}</span> Home Dashboard
          </button>
          <button onClick={() => { onSelectTab('controls'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>\u{1F39B}\uFE0F</span> UI Controls
          </button>
          <button onClick={() => { onSelectTab('overlays'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>\u2728</span> Overlays & Dialogs
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #334155' }}>
          CapKit \u2022 Mobile Ready
        </div>
      </aside>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/toast.ts
function getVanillaToastTemplate(isTs) {
  const tsType = isTs ? ': { message: string; type?: "info" | "success" | "warning" | "error"; onClose: () => void }' : "";
  return `import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    info: '#0284c7',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
  }[type]

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      paddingTop: 'env(safe-area-inset-top)',
      zIndex: 50,
      width: '90%',
      maxWidth: '360px',
    }}>
      <div style={{
        background: colors,
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
      }}>
        <span>{message}</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>\u2715</button>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/alertDialog.ts
function getVanillaAlertDialogTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }" : "";
  return `import React from 'react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} onClick={onCancel} />
      <div style={{
        position: 'relative',
        background: '#1e293b',
        color: '#f8fafc',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '12px', marginBottom: '24px' }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #475569', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/bottomSheet.ts
function getVanillaBottomSheetTemplate(isTs) {
  const tsType = isTs ? ": { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }" : "";
  return `import React from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#1e293b',
        color: '#f8fafc',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        boxShadow: '0 -10px 25px -5px rgba(0,0,0,0.5)',
        zIndex: 10,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '40px', height: '4px', background: '#475569', borderRadius: '9999px', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>\u2715</button>
        </div>
        {children}
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/loadingSpinner.ts
function getVanillaLoadingSpinnerTemplate(isTs) {
  return `import React from 'react'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #334155',
        borderTopColor: '#38bdf8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/skeleton.ts
function getVanillaSkeletonTemplate(isTs) {
  return `import React from 'react'

export default function Skeleton() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <div style={{ height: '96px', background: '#334155', borderRadius: '12px', opacity: 0.6 }} />
      <div style={{ height: '16px', width: '60%', background: '#334155', borderRadius: '6px', opacity: 0.6 }} />
      <div style={{ height: '16px', width: '80%', background: '#334155', borderRadius: '6px', opacity: 0.6 }} />
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/segmentedControl.ts
function getVanillaSegmentedControlTemplate(isTs) {
  const tsType = isTs ? ": { options: string[]; selected: string; onChange: (val: string) => void }" : "";
  return `import React from 'react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '12px', width: '100%' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: selected === opt ? '#38bdf8' : 'transparent',
            color: selected === opt ? '#0f172a' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'capitalize',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/pullToRefresh.ts
function getVanillaPullToRefreshTemplate(isTs) {
  const tsType = isTs ? ": { onRefresh: () => Promise<void>; children: React.ReactNode }" : "";
  return `import React, { useState } from 'react'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ padding: '4px 12px', background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '9999px', fontSize: '12px', cursor: 'pointer' }}
        >
          {refreshing ? 'Refreshing...' : '\u2193 Pull to Refresh'}
        </button>
      </div>
      {children}
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/components/toggleSwitch.ts
function getVanillaToggleSwitchTemplate(isTs) {
  const tsType = isTs ? ": { checked: boolean; onChange: (val: boolean) => void; label?: string }" : "";
  return `import React from 'react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
      {label && <span style={{ fontSize: '14px', color: '#f8fafc' }}>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '20px', height: '20px', accentColor: '#38bdf8', cursor: 'pointer' }}
      />
    </label>
  )
}
`;
}

// src/generators/templates/vanilla/components/badge.ts
function getVanillaBadgeTemplate(isTs) {
  const tsType = isTs ? ": { children: React.ReactNode; color?: string }" : "";
  return `import React from 'react'

export default function Badge({ children, color = '#38bdf8' }${tsType}) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      background: color,
      color: '#0f172a',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 'bold',
    }}>
      {children}
    </span>
  )
}
`;
}

// src/generators/templates/vanilla/views/homeView.ts
function getVanillaHomeViewTemplate(isTs) {
  const tsType = isTs ? ": { onOpenSheet: () => void; onShowToast: (msg: string) => void }" : "";
  return `import React from 'react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>CapKit Mobile</h2>
          <Badge>Starter</Badge>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
          Pure modular responsive mobile UI components with safe-area insets, interactive drawers, tabs, and alerts.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={onOpenSheet} style={{ padding: '8px 16px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
            Action Sheet
          </button>
          <button onClick={() => onShowToast('Hello from CapKit!')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #475569', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
            Toast
          </button>
        </div>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/views/controlsView.ts
function getVanillaControlsViewTemplate(isTs) {
  return `import React, { useState } from 'react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Segmented Tabs</h3>
        <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
      </div>

      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Mobile Switches</h3>
        <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
        <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />
        <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Badge color="#4ade80">Active</Badge>
        <Badge color="#fbbf24">Pending</Badge>
        <Badge color="#c084fc">Pro</Badge>
      </div>
    </div>
  )
}
`;
}

// src/generators/templates/vanilla/views/overlaysView.ts
function getVanillaOverlaysViewTemplate(isTs) {
  const tsType = isTs ? ": { onShowAlert: () => void; onShowToast: (msg: string, type?: any) => void; onOpenSheet: () => void }" : "";
  return `import React, { useState } from 'react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Feedback & Dialogs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button onClick={onShowAlert} style={{ padding: '8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Alert</button>
          <button onClick={() => onShowToast('Success notification!', 'success')} style={{ padding: '8px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Success</button>
          <button onClick={() => onShowToast('Warning notification!', 'warning')} style={{ padding: '8px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Warning</button>
          <button onClick={onOpenSheet} style={{ padding: '8px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Bottom Sheet</button>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Loading States</h3>
          <button onClick={() => setShowSkeleton(!showSkeleton)} style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Toggle</button>
        </div>
        {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
      </div>
    </div>
  )
}
`;
}

// src/generators/vanillaComponents.ts
async function generateVanillaComponents(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const indexExt = isTs ? "ts" : "js";
  async function writeComponent(folderName, componentName, code) {
    const componentDir = path11.join(targetDir, "src", "components", folderName);
    await writeFile(path11.join(componentDir, `${componentName}.${ext}`), code);
    await writeFile(
      path11.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'
`
    );
  }
  async function writeView(folderName, viewName, code) {
    const viewDir = path11.join(targetDir, "src", "views", folderName);
    await writeFile(path11.join(viewDir, `${viewName}.${ext}`), code);
    await writeFile(
      path11.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'
`
    );
  }
  await writeComponent("appHeader", "AppHeader", getVanillaAppHeaderTemplate(isTs));
  await writeComponent("tabBar", "TabBar", getVanillaTabBarTemplate(isTs));
  await writeComponent("appSidebar", "AppSidebar", getVanillaAppSidebarTemplate(isTs));
  await writeComponent("toast", "Toast", getVanillaToastTemplate(isTs));
  await writeComponent("alertDialog", "AlertDialog", getVanillaAlertDialogTemplate(isTs));
  await writeComponent("bottomSheet", "BottomSheet", getVanillaBottomSheetTemplate(isTs));
  await writeComponent("loadingSpinner", "LoadingSpinner", getVanillaLoadingSpinnerTemplate(isTs));
  await writeComponent("skeleton", "Skeleton", getVanillaSkeletonTemplate(isTs));
  await writeComponent("segmentedControl", "SegmentedControl", getVanillaSegmentedControlTemplate(isTs));
  await writeComponent("pullToRefresh", "PullToRefresh", getVanillaPullToRefreshTemplate(isTs));
  await writeComponent("toggleSwitch", "ToggleSwitch", getVanillaToggleSwitchTemplate(isTs));
  await writeComponent("badge", "Badge", getVanillaBadgeTemplate(isTs));
  await writeView("homeView", "HomeView", getVanillaHomeViewTemplate(isTs));
  await writeView("controlsView", "ControlsView", getVanillaControlsViewTemplate(isTs));
  await writeView("overlaysView", "OverlaysView", getVanillaOverlaysViewTemplate(isTs));
}

// src/generators/templates/vanilla/app.ts
function getVanillaAppTemplate(options, isTs) {
  return `import { useState } from 'react'
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' | 'error' } | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ message, type })
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#0f172a', color: '#f8fafc' }}>
      <AppHeader
        title="${options.projectName}"
        onOpenSidebar={() => setSidebarOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {currentTab === 'home' && (
          <HomeView
            onOpenSheet={() => setSheetOpen(true)}
            onShowToast={(msg) => showToast(msg, 'info')}
          />
        )}
        {currentTab === 'controls' && <ControlsView />}
        {currentTab === 'overlays' && (
          <OverlaysView
            onShowAlert={() => setAlertOpen(true)}
            onShowToast={showToast}
            onOpenSheet={() => setSheetOpen(true)}
          />
        )}
      </main>

      <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTab={setCurrentTab}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={alertOpen}
        title="Confirm Operation"
        description="Are you sure you want to perform this operation?"
        onConfirm={() => {
          setAlertOpen(false)
          showToast('Confirmed successfully!', 'success')
        }}
        onCancel={() => setAlertOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Action Sheet"
      >
        <button
          onClick={() => {
            setSheetOpen(false)
            showToast('Item shared!', 'success')
          }}
          style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Share Content
        </button>
      </BottomSheet>
    </div>
  )
}
`;
}

// src/generators/stylingGenerators.ts
import path12 from "pathe";

// src/generators/templates/scss/_variables.ts
function getScssVariablesTemplate() {
  return `// \u2500\u2500\u2500 Design Tokens \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Customise these variables to match your brand.

// Colors
$color-primary:    #7c3aed;
$color-secondary:  #06b6d4;
$color-success:    #10b981;
$color-warning:    #f59e0b;
$color-danger:     #ef4444;
$color-info:       #3b82f6;

// Background
$bg-dark:      #0f172a;
$bg-surface:   #1e293b;
$bg-card:      #1e293b;

// Text
$text-primary:   #f8fafc;
$text-secondary: #94a3b8;

// Spacing
$space-xs: 4px;
$space-sm: 8px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;

// Radius
$radius-sm:  8px;
$radius-md: 12px;
$radius-lg: 20px;
$radius-xl: 28px;

// Font
$font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// Safe area
$safe-top:    env(safe-area-inset-top, 0px);
$safe-bottom: env(safe-area-inset-bottom, 0px);
`;
}

// src/generators/templates/scss/main.ts
function getScssMainTemplate() {
  return `@use './variables' as *;

// \u2500\u2500\u2500 Reset & Base \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: $font-sans;
  background-color: $bg-dark;
  color: $text-primary;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

// \u2500\u2500\u2500 Utility Mixins \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
@mixin card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: $space-lg;
}

@mixin glass {
  background: rgba($bg-surface, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

// \u2500\u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  padding: 10px 20px;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;

  &:active { transform: scale(0.97); }

  &--primary {
    background: $color-primary;
    color: white;
    &:hover { box-shadow: 0 4px 14px rgba($color-primary, 0.4); }
  }

  &--danger {
    background: transparent;
    color: $color-danger;
    border: 1px solid $color-danger;
    &:hover { background: rgba($color-danger, 0.1); }
  }
}
`;
}

// src/generators/stylingGenerators.ts
async function generateStylingFiles(targetDir, options) {
  switch (options.style) {
    case "scss": {
      await writeFile(
        path12.join(targetDir, "src", "styles", "_variables.scss"),
        getScssVariablesTemplate()
      );
      await writeFile(
        path12.join(targetDir, "src", "styles", "main.scss"),
        getScssMainTemplate()
      );
      break;
    }
    case "unocss": {
      const unoConfig = `import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2 }),
  ],
  theme: {
    colors: {
      primary: '#7c3aed',
      secondary: '#06b6d4',
    },
  },
})
`;
      const ext = options.language === "ts" ? "ts" : "js";
      await writeFile(path12.join(targetDir, `uno.config.${ext}`), unoConfig);
      break;
    }
    // bootstrap, cssmodules, vanilla, tailwind — no extra files needed
    default:
      break;
  }
}

// src/generators/files.ts
async function generateProjectFiles(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const configExt = isTs ? "ts" : "js";
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${options.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;
  await writeFile(path13.join(targetDir, "index.html"), indexHtml);
  let viteConfig = "";
  if (options.style === "tailwind") {
    viteConfig = `import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
})
`;
  } else if (options.style === "unocss") {
    viteConfig = `import UnoCSS from '@unocss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: true,
    port: 5173,
  },
})
`;
  } else {
    viteConfig = `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
`;
  }
  await writeFile(path13.join(targetDir, `vite.config.${configExt}`), viteConfig);
  let mainImports = `import './index.css'`;
  if (options.style === "scss") {
    mainImports = `import './styles/main.scss'`;
  } else if (options.style === "unocss") {
    mainImports = `import 'virtual:uno.css'
import './index.css'`;
  }
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
${mainImports}
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTs ? "!" : ""}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;
  await writeFile(path13.join(targetDir, "src", `main.${ext}`), mainContent);
  let indexCss = "";
  if (options.style === "tailwind" && options.uiLibrary === "konsta") {
    indexCss = `@import "tailwindcss";
@import "konsta/theme.css";
@source "../node_modules/konsta";

body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`;
  } else if (options.style === "tailwind" && options.uiLibrary === "daisy") {
    indexCss = `@import "tailwindcss";
@plugin "daisyui";

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`;
  } else if (options.style === "tailwind") {
    indexCss = `@import "tailwindcss";

body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`;
  } else if (options.style === "bootstrap") {
    indexCss = `@import "bootstrap/dist/css/bootstrap.min.css";

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`;
  } else {
    indexCss = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`;
  }
  await writeFile(path13.join(targetDir, "src", "index.css"), indexCss);
  await generateStylingFiles(targetDir, options);
  let appContent = "";
  switch (options.uiLibrary) {
    case "konsta":
      await generateKonstaComponents(targetDir, options);
      appContent = getKonstaAppTemplate(options, isTs);
      break;
    case "daisy":
      await generateDaisyComponents(targetDir, options);
      appContent = getDaisyAppTemplate(options, isTs);
      break;
    case "ionic":
      await generateIonicComponents(targetDir, options);
      appContent = getIonicAppTemplate(options, isTs);
      break;
    case "heroui":
      await generateHeroUIComponents(targetDir, options);
      appContent = getHeroUIAppTemplate(options, isTs);
      break;
    case "mui":
      await generateMUIComponents(targetDir, options);
      appContent = getMUIAppTemplate(options, isTs);
      break;
    case "framework7":
      await generateFramework7Components(targetDir, options);
      appContent = getFramework7AppTemplate(options, isTs);
      break;
    case "shadcn":
      await generateTailwindComponents(targetDir, options);
      appContent = getAppTemplate(options, isTs);
      break;
    case "none":
    default:
      if (options.style === "tailwind") {
        await generateTailwindComponents(targetDir, options);
        appContent = getAppTemplate(options, isTs);
      } else {
        await generateVanillaComponents(targetDir, options);
        appContent = getVanillaAppTemplate(options, isTs);
      }
      break;
  }
  await writeFile(path13.join(targetDir, "src", `App.${ext}`), appContent);
  if (isTs) {
    const tsconfig = {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" }
      ]
    };
    await writeJson(path13.join(targetDir, "tsconfig.json"), tsconfig);
    const tsconfigApp = {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true
      },
      include: ["src"]
    };
    await writeJson(path13.join(targetDir, "tsconfig.app.json"), tsconfigApp);
    const tsconfigNode = {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        target: "ES2022",
        lib: ["ES2023"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true
      },
      include: ["vite.config.ts"]
    };
    await writeJson(path13.join(targetDir, "tsconfig.node.json"), tsconfigNode);
  }
  const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;
  await writeFile(path13.join(targetDir, ".gitignore"), gitignore);
  const readmeContent = `# ${options.projectName}

Scaffolded with **[CapKit](https://github.com/w15147m/capkit)** \u2014 Interactive Capacitor starter kit.

## \u{1F680} Tech Stack

- **Framework**: React 19 (${options.language.toUpperCase()})
- **Build Tool**: Vite
- **Styling**: ${getStyleLabel(options.style)}
${options.uiLibrary !== "none" ? `- **UI Library**: ${getUILibraryLabel(options.uiLibrary)}
` : ""}${options.android ? "- **Native Runtime**: Capacitor 8 (Android)\n" : ""}

---

## \u{1F6E0}\uFE0F Getting Started (Development Server)

### 1. Install Dependencies

\`\`\`bash
${options.packageManager} install
\`\`\`

### 2. Start the Vite Dev Server

\`\`\`bash
npm run dev -- --host
\`\`\`

> **Note**: The \`--host\` flag exposes Vite to your local network on \`http://localhost:5173\`.

---

${options.android ? `## \u{1F4F1} Running on Android with Live Reload

CapKit is pre-configured with **instant live reload (HMR)** on physical devices and emulators.

### Step 1: Connect your Phone
1. Enable **Developer Options** and **USB Debugging** on your Android device.
2. Connect your phone to your computer via USB.
3. Verify your device is detected:
   \`\`\`bash
   adb devices
   \`\`\`

### Step 2: Forward Ports via ADB Reverse
Reverse the Vite dev server port so the phone can access \`http://localhost:5173\` directly:
\`\`\`bash
adb reverse tcp:5173 tcp:5173
\`\`\`

### Step 3: Run the App on Android
In a separate terminal (while \`npm run dev -- --host\` is running):
\`\`\`bash
npx cap run android
\`\`\`
Or open the native Android project in Android Studio:
\`\`\`bash
npx cap open android
\`\`\`

---

## \u2699\uFE0F Capacitor & Android Configuration

- **Live Reload**: \`capacitor.config.json\` is configured to load \`http://localhost:5173\` during development. Any code changes will instantly update on your phone screen.
- **Java 21 Requirement**: Capacitor 8 Android builds require Java 21 JDK. \`android/gradle.properties\` is configured with \`org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64\`.

---

## \u{1F4E6} Production Build

When you are ready to build a standalone offline release APK:
1. In \`capacitor.config.json\`, remove the \`server\` configuration object.
2. Run \`npm run build\` to produce the web bundle into \`dist/\`.
3. Sync assets to native project:
   \`\`\`bash
   npx cap sync
   \`\`\`
4. Build APK in Android Studio or via Gradle:
   \`\`\`bash
   cd android && ./gradlew assembleRelease
   \`\`\`
` : ""}
`;
  await writeFile(path13.join(targetDir, "README.md"), readmeContent);
}
function getStyleLabel(style) {
  const labels = {
    tailwind: "Tailwind CSS v4",
    scss: "SCSS / Sass",
    cssmodules: "CSS Modules",
    bootstrap: "Bootstrap 5",
    unocss: "UnoCSS",
    vanilla: "Vanilla CSS"
  };
  return labels[style] ?? style;
}
function getUILibraryLabel(lib) {
  const labels = {
    konsta: "Konsta UI (iOS & Material)",
    daisy: "DaisyUI",
    shadcn: "shadcn/ui",
    heroui: "HeroUI (NextUI)",
    ionic: "Ionic React",
    framework7: "Framework7",
    mui: "Material UI"
  };
  return labels[lib] ?? lib;
}

// src/generators/project.ts
async function generateProject(options) {
  const targetDir = options.targetDir;
  await ensureDir(targetDir);
  const packageJson = generatePackageJson(options);
  await writeJson(path14.join(targetDir, "package.json"), packageJson);
  await generateProjectFiles(targetDir, options);
  if (options.android) {
    await ensureDir(path14.join(targetDir, "dist"));
    await writeFile(
      path14.join(targetDir, "dist", "index.html"),
      "<!doctype html><html><body></body></html>"
    );
    await generateCapacitorConfig(targetDir, options);
  }
  if (options.install) {
    await installDependencies(targetDir, options.packageManager);
    if (options.android) {
      try {
        await execa2("npx", ["cap", "add", "android"], { cwd: targetDir, stdio: "ignore" });
        await generateAndroidGradleConfig(targetDir);
      } catch (err) {
      }
    }
  }
}

// src/index.ts
async function main() {
  const targetDirArg = process.argv.slice(2)[0];
  const options = await runPrompts(targetDirArg);
  const spinner2 = p2.spinner();
  spinner2.start("Scaffolding project files\u2026");
  try {
    await generateProject(options);
    spinner2.stop("Project files created!");
  } catch (err) {
    spinner2.stop(pc2.red("Failed to scaffold project!"));
    console.error(err);
    process.exit(1);
  }
  if (options.install) {
    const installSpinner = p2.spinner();
    installSpinner.start(`Installing dependencies with ${options.packageManager}\u2026`);
    installSpinner.stop("Dependencies installed!");
  }
  const isCurrentDir = options.targetDir === process.cwd();
  const relativeDir = isCurrentDir ? "" : path15.relative(process.cwd(), options.targetDir);
  p2.note(
    [
      relativeDir ? pc2.cyan(`cd ${relativeDir}`) : "",
      options.install ? "" : pc2.cyan(`${options.packageManager} install`),
      !options.install && options.android ? pc2.cyan("npx cap add android") : "",
      pc2.cyan("npm run dev -- --host"),
      "",
      options.android ? [
        pc2.dim("# On a separate terminal:"),
        pc2.cyan("adb reverse tcp:5173 tcp:5173"),
        pc2.cyan("npx cap run android")
      ].join("\n") : ""
    ].filter(Boolean).join("\n"),
    "Next steps"
  );
  p2.outro(pc2.green("\u2714 Your Capacitor app is ready!"));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
