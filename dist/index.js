#!/usr/bin/env node

// src/index.ts
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";
import path7 from "pathe";

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
import path6 from "pathe";
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
import path5 from "pathe";

// src/generators/tailwindComponents.ts
import path4 from "pathe";
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
  const appHeaderCode = `import React from 'react'

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
  await writeComponent("appHeader", "AppHeader", appHeaderCode);
  const tabBarCode = `import React from 'react'

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
  await writeComponent("tabBar", "TabBar", tabBarCode);
  const appSidebarCode = `import React from 'react'

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
  await writeComponent("appSidebar", "AppSidebar", appSidebarCode);
  const toastCode = `import React, { useEffect } from 'react'

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
  await writeComponent("toast", "Toast", toastCode);
  const alertDialogCode = `import React from 'react'

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
  await writeComponent("alertDialog", "AlertDialog", alertDialogCode);
  const bottomSheetCode = `import React from 'react'

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
  await writeComponent("bottomSheet", "BottomSheet", bottomSheetCode);
  const loadingSpinnerCode = `import React from 'react'

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
  await writeComponent("loadingSpinner", "LoadingSpinner", loadingSpinnerCode);
  const skeletonCode = `import React from 'react'

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
  await writeComponent("skeleton", "Skeleton", skeletonCode);
  const segmentedControlCode = `import React from 'react'

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
  await writeComponent("segmentedControl", "SegmentedControl", segmentedControlCode);
  const pullToRefreshCode = `import React, { useState, useRef } from 'react'

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
  await writeComponent("pullToRefresh", "PullToRefresh", pullToRefreshCode);
  const toggleSwitchCode = `import React from 'react'

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
  await writeComponent("toggleSwitch", "ToggleSwitch", toggleSwitchCode);
  const badgeCode = `import React from 'react'

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
  await writeComponent("badge", "Badge", badgeCode);
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
  await writeFile(path5.join(targetDir, "index.html"), indexHtml);
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
  await writeFile(path5.join(targetDir, `vite.config.${configExt}`), viteConfig);
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
  await writeFile(path5.join(targetDir, "src", `main.${ext}`), mainContent);
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
  await writeFile(path5.join(targetDir, "src", "index.css"), indexCss);
  let appContent = "";
  if (options.konsta) {
    appContent = `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}
import {
  App as KonstaApp,
  Page,
  Navbar,
  Block,
  BlockTitle,
  Card,
  Button,
  List,
  ListItem,
  Badge,
  Toggle,
} from 'konsta/react'

function App() {
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  const [darkMode, setDarkMode] = useState${isTs ? "<boolean>" : ""}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? "<boolean>" : ""}(true)

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

  return (
    <div className={darkMode ? 'dark k-dark' : ''}>
      <KonstaApp theme={theme} dark={darkMode} safeAreas className={darkMode ? 'dark k-dark' : ''}>
        <Page className={darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}>
          <Navbar
            title="${options.projectName}"
            subtitle="Capacitor + Konsta"
            className="top-0 sticky"
            right={
              <div className="flex items-center gap-2 pr-2">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-1.5 rounded-full bg-slate-800 text-amber-300"
                  aria-label="Toggle Theme"
                >
                  {darkMode ? '\u{1F319}' : '\u2600\uFE0F'}
                </button>
                <Badge colors={{ bg: isNative ? 'bg-emerald-500' : 'bg-blue-500' }}>
                  {platform.toUpperCase()}
                </Badge>
              </div>
            }
          />

          <Block className="text-center pt-4">
            <h1 className={\`text-2xl font-bold tracking-tight \${darkMode ? 'text-white' : 'text-slate-900'}\`}>
              ${options.projectName}
            </h1>
            <p className={\`text-xs mt-1 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
              Konsta UI \u2022 Tailwind CSS v4 \u2022 Capacitor {isNative ? 'Native' : 'Web'}
            </p>
          </Block>

          <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            Interactive State & HMR
          </BlockTitle>
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
              <Button rounded className="w-auto px-4" onClick={() => setCount((c) => c + 1)}>
                Increment ({count})
              </Button>
            </div>
          </Card>

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
              onClick={() => setDarkMode(!darkMode)}
              link
              after={
                <Toggle
                  checked={darkMode}
                  onChange={(e${isTs ? ": React.ChangeEvent<HTMLInputElement>" : ""}) => setDarkMode(e.target.checked)}
                />
              }
            />
            <ListItem
              title="Haptics Feedback"
              text={hapticsEnabled ? 'Vibration enabled' : 'Disabled'}
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              link
              after={
                <Toggle
                  checked={hapticsEnabled}
                  onChange={(e${isTs ? ": React.ChangeEvent<HTMLInputElement>" : ""}) => setHapticsEnabled(e.target.checked)}
                />
              }
            />
          </List>
        </Page>
      </KonstaApp>
    </div>
  )
}

export default App
`;
  } else if (options.tailwind) {
    await generateTailwindComponents(targetDir, options);
    appContent = `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast${isTs ? ", { ToastType }" : ""} from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import LoadingSpinner from './components/loadingSpinner'
import Skeleton from './components/skeleton'
import SegmentedControl from './components/segmentedControl'
import PullToRefresh from './components/pullToRefresh'
import ToggleSwitch from './components/toggleSwitch'
import Badge from './components/badge'

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? "<string>" : ""}('home')
  const [activeSegment, setActiveSegment] = useState${isTs ? "<string>" : ""}('overview')
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
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Slide-out Navigation Drawer */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="CapKit Navigation"
        items={sidebarItems}
        darkMode={darkMode}
      />

      {/* Alert Dialog Popup */}
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

      {/* Draggable Bottom Sheet */}
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

      {/* Sticky App Header */}
      <AppHeader
        title="${options.projectName}"
        subtitle="Mobile Component Suite"
        platform={platform}
        isNative={isNative}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Main Tab Content with PullToRefresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-md mx-auto px-4 pb-24 pt-4 space-y-5">
          {activeTab === 'home' && (
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
                      onClick={() => setIsBottomSheetOpen(true)}
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
                    >
                      Open BottomSheet \u2197
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Pull-to-refresh enabled on top!', 'info')}
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
                      onClick={() => {
                        setCount((c) => c + 1)
                        if (count + 1 % 5 === 0) showToast(\`Reached \${count + 1} taps! \u{1F389}\`, 'success')
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                    >
                      Increment ({count})
                    </button>
                    {count > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAlertOpen(true)}
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
                      onClick={handleRefresh}
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
          )}

          {/* Controls Tab */}
          {activeTab === 'controls' && (
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
                    onChange={setDarkMode}
                  />
                  <div className="pt-2">
                    <ToggleSwitch
                      label="Haptics Vibration"
                      description="Vibrate device on interactive feedback"
                      checked={hapticsEnabled}
                      onChange={(val) => {
                        setHapticsEnabled(val)
                        showToast(val ? 'Haptics enabled' : 'Haptics disabled', 'info')
                      }}
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
                    onClick={() => setIsBottomSheetOpen(true)}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    Open BottomSheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAlertOpen(true)}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    Show Alert Dialog
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Overlays Tab */}
          {activeTab === 'overlays' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Toast Notification Triggers
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Success! Operation completed.', 'success')}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    \u2713 Success Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Error! Connection failed.', 'error')}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    \u2715 Error Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Warning! Low battery detected.', 'warning')}
                    className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    \u26A0 Warning Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Info: New update available.', 'info')}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    \u2139 Info Toast
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </PullToRefresh>

      {/* Sticky Bottom Tab Bar */}
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
  await writeFile(path5.join(targetDir, "src", `App.${ext}`), appContent);
  if (isTs) {
    const tsconfig = {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" }
      ]
    };
    await writeJson(path5.join(targetDir, "tsconfig.json"), tsconfig);
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
    await writeJson(path5.join(targetDir, "tsconfig.app.json"), tsconfigApp);
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
    await writeJson(path5.join(targetDir, "tsconfig.node.json"), tsconfigNode);
  }
  const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;
  await writeFile(path5.join(targetDir, ".gitignore"), gitignore);
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
  await writeFile(path5.join(targetDir, "README.md"), readmeContent);
}

// src/generators/project.ts
async function generateProject(options) {
  const targetDir = options.targetDir;
  await ensureDir(targetDir);
  const packageJson = generatePackageJson(options);
  await writeJson(path6.join(targetDir, "package.json"), packageJson);
  await generateProjectFiles(targetDir, options);
  if (options.android) {
    await ensureDir(path6.join(targetDir, "dist"));
    await writeFile(
      path6.join(targetDir, "dist", "index.html"),
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
  const relativeDir = isCurrentDir ? "" : path7.relative(process.cwd(), options.targetDir);
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
