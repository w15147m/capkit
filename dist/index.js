#!/usr/bin/env node

// src/index.ts
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";
import path8 from "pathe";

// src/prompts/index.ts
import * as p from "@clack/prompts";
import pc from "picocolors";
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
    stdio: "ignore"
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
      tailwind: () => p.confirm({
        message: "Include Tailwind CSS v4?",
        initialValue: true
      }),
      konsta: ({ results: results2 }) => {
        if (!results2.tailwind) {
          p.log.warn("Konsta UI requires Tailwind CSS \u2014 skipping.");
          return Promise.resolve(false);
        }
        return p.confirm({
          message: "Include Konsta UI mobile components (native iOS / Android look)?",
          initialValue: true
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
  return {
    projectName: finalProjectName,
    targetDir: finalTargetDir,
    framework: "react",
    language: results.language ?? "ts",
    tailwind: Boolean(results.tailwind),
    konsta: Boolean(results.konsta),
    android: Boolean(results.android),
    packageManager: results.packageManager,
    install: Boolean(results.install)
  };
}

// src/generators/project.ts
import path7 from "pathe";
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
  if (options.tailwind) {
    dependencies["tailwindcss"] = "^4.3.3";
    dependencies["@tailwindcss/vite"] = "^4.3.3";
  }
  if (options.konsta) {
    dependencies["konsta"] = "^5.4.0";
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
import path6 from "pathe";

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
      className={\`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 px-2 \${
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
  return `import React, { useEffect } from 'react'

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

  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-slate-950',
    info: 'bg-blue-600 text-white',
  }

  const icons = {
    success: '\u2713',
    error: '\u2715',
    warning: '\u26A0',
    info: '\u2139',
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none pt-[env(safe-area-inset-top,0px)]">
      <div
        className={\`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl font-medium text-xs max-w-sm w-full transition-all animate-in slide-in-from-top-4 \${
          typeStyles[type]
        }\`}
      >
        <span className="font-bold">{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 font-bold ml-1">
          \u2715
        </button>
      </div>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
    <div className="fixed inset-0 z-50 flex items-end">
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
    <Tabbar className="bottom-0 fixed left-0 right-0 z-40">
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
  return `import React, { useEffect } from 'react'
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

  return (
    <KonstaToast
      position="top"
      opened={opened}
      button={<Button rounded clear inline onClick={onClose}>\u2715</Button>}
      className="z-50"
    >
      <div className="shrink">{text}</div>
    </KonstaToast>
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
      className={\`rounded-t-3xl pb-6 \${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}\`}
    >
      <div className="p-4">
        {title && <BlockTitle className="text-center font-bold text-base mb-2">{title}</BlockTitle>}
        <Block>{children}</Block>
        <div className="mt-4 px-4">
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
  await writeFile(path6.join(targetDir, "index.html"), indexHtml);
  let viteConfig = "";
  if (options.tailwind) {
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
  await writeFile(path6.join(targetDir, `vite.config.${configExt}`), viteConfig);
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTs ? "!" : ""}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;
  await writeFile(path6.join(targetDir, "src", `main.${ext}`), mainContent);
  let indexCss = "";
  if (options.tailwind && options.konsta) {
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
  } else if (options.tailwind) {
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
  } else {
    indexCss = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
`;
  }
  await writeFile(path6.join(targetDir, "src", "index.css"), indexCss);
  let appContent = "";
  if (options.konsta) {
    await generateKonstaComponents(targetDir, options);
    appContent = getKonstaAppTemplate(options, isTs);
  } else if (options.tailwind) {
    await generateTailwindComponents(targetDir, options);
    appContent = getAppTemplate(options, isTs);
  } else {
    appContent = `import { useState } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}

function App() {
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  ${options.android ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()` : `const platform = 'web'
  const isNative = false`}

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>${options.projectName}</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Platform: {platform.toUpperCase()} {isNative ? '\u2022 NATIVE' : '\u2022 WEB'}
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
    </div>
  )
}

export default App
`;
  }
  await writeFile(path6.join(targetDir, "src", `App.${ext}`), appContent);
  if (isTs) {
    const tsconfig = {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" }
      ]
    };
    await writeJson(path6.join(targetDir, "tsconfig.json"), tsconfig);
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
    await writeJson(path6.join(targetDir, "tsconfig.app.json"), tsconfigApp);
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
    await writeJson(path6.join(targetDir, "tsconfig.node.json"), tsconfigNode);
  }
  const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;
  await writeFile(path6.join(targetDir, ".gitignore"), gitignore);
  const readmeContent = `# ${options.projectName}

Scaffolded with **[CapKit](https://github.com/w15147m/capkit)** \u2014 Interactive Capacitor starter kit.

## \u{1F680} Tech Stack

- **Framework**: React 19 (${options.language.toUpperCase()})
- **Build Tool**: Vite
${options.tailwind ? "- **Styling**: Tailwind CSS v4\n" : ""}${options.konsta ? "- **Mobile UI Components**: Konsta UI (iOS & Material design)\n" : ""}${options.android ? "- **Native Runtime**: Capacitor 8 (Android)\n" : ""}

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
  await writeFile(path6.join(targetDir, "README.md"), readmeContent);
}

// src/generators/project.ts
async function generateProject(options) {
  const targetDir = options.targetDir;
  await ensureDir(targetDir);
  const packageJson = generatePackageJson(options);
  await writeJson(path7.join(targetDir, "package.json"), packageJson);
  await generateProjectFiles(targetDir, options);
  if (options.android) {
    await ensureDir(path7.join(targetDir, "dist"));
    await writeFile(
      path7.join(targetDir, "dist", "index.html"),
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
  const relativeDir = isCurrentDir ? "" : path8.relative(process.cwd(), options.targetDir);
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
