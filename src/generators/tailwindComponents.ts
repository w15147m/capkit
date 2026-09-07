import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'

export async function generateTailwindComponents(targetDir: string, options: ProjectOptions): Promise<void> {
  const isTs = options.language === 'ts'
  const ext = isTs ? 'tsx' : 'jsx'
  const indexExt = isTs ? 'ts' : 'js'

  // Helper to write component folder + index.ts
  async function writeComponent(folderName: string, componentName: string, code: string) {
    const componentDir = path.join(targetDir, 'src', 'components', folderName)
    await writeFile(path.join(componentDir, `${componentName}.${ext}`), code)
    await writeFile(
      path.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'\n`
    )
  }

  // 1. AppHeader
  const appHeaderCode = `import React from 'react'

${isTs ? `export interface AppHeaderProps {
  title: string
  subtitle?: string
  platform?: string
  isNative?: boolean
  darkMode?: boolean
  onToggleTheme?: () => void
  onOpenSidebar?: () => void
}` : ''}

export default function AppHeader({
  title,
  subtitle,
  platform = 'web',
  isNative = false,
  darkMode = true,
  onToggleTheme,
  onOpenSidebar,
}${isTs ? ': AppHeaderProps' : ''}) {
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
              {darkMode ? '🌙' : '☀️'}
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
`
  await writeComponent('appHeader', 'AppHeader', appHeaderCode)

  // 2. TabBar
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
}` : ''}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  darkMode = true,
}${isTs ? ': TabBarProps' : ''}) {
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
`
  await writeComponent('tabBar', 'TabBar', tabBarCode)

  // 3. AppSidebar
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
}` : ''}

export default function AppSidebar({
  isOpen,
  onClose,
  title = 'Menu',
  items,
  darkMode = true,
}${isTs ? ': AppSidebarProps' : ''}) {
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
            ✕
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
          CapKit Mobile Starter • v0.1.0
        </div>
      </div>
    </div>
  )
}
`
  await writeComponent('appSidebar', 'AppSidebar', appSidebarCode)

  // 4. Toast
  const toastCode = `import React, { useEffect } from 'react'

${isTs ? `export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  type?: ToastType
  message: string
  duration?: number
  onClose: () => void
}` : ''}

export default function Toast({
  type = 'info',
  message,
  duration = 3000,
  onClose,
}${isTs ? ': ToastProps' : ''}) {
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
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
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
          ✕
        </button>
      </div>
    </div>
  )
}
`
  await writeComponent('toast', 'Toast', toastCode)

  // 5. AlertDialog
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
}` : ''}

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
}${isTs ? ': AlertDialogProps' : ''}) {
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
`
  await writeComponent('alertDialog', 'AlertDialog', alertDialogCode)

  // 6. BottomSheet
  const bottomSheetCode = `import React from 'react'

${isTs ? `export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  darkMode?: boolean
}` : ''}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  darkMode = true,
}${isTs ? ': BottomSheetProps' : ''}) {
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
              ✕
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}
`
  await writeComponent('bottomSheet', 'BottomSheet', bottomSheetCode)

  // 7. LoadingSpinner
  const loadingSpinnerCode = `import React from 'react'

${isTs ? `export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}` : ''}

export default function LoadingSpinner({
  size = 'md',
  label,
}${isTs ? ': LoadingSpinnerProps' : ''}) {
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
`
  await writeComponent('loadingSpinner', 'LoadingSpinner', loadingSpinnerCode)

  // 8. Skeleton
  const skeletonCode = `import React from 'react'

${isTs ? `export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  darkMode?: boolean
}` : ''}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  darkMode = true,
}${isTs ? ': SkeletonProps' : ''}) {
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
`
  await writeComponent('skeleton', 'Skeleton', skeletonCode)

  // 9. SegmentedControl
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
}` : ''}

export default function SegmentedControl({
  options,
  value,
  onChange,
  darkMode = true,
}${isTs ? ': SegmentedControlProps' : ''}) {
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
`
  await writeComponent('segmentedControl', 'SegmentedControl', segmentedControlCode)

  // 10. PullToRefresh
  const pullToRefreshCode = `import React, { useState, useRef } from 'react'

${isTs ? `export interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}` : ''}

export default function PullToRefresh({
  onRefresh,
  children,
}${isTs ? ': PullToRefreshProps' : ''}) {
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = (e${isTs ? ': React.TouchEvent' : ''}) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e${isTs ? ': React.TouchEvent' : ''}) => {
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
          {isRefreshing ? 'Refreshing…' : pullY > 50 ? 'Release to refresh' : 'Pull down to refresh'}
        </div>
      )}
      {children}
    </div>
  )
}
`
  await writeComponent('pullToRefresh', 'PullToRefresh', pullToRefreshCode)

  // 11. ToggleSwitch
  const toggleSwitchCode = `import React from 'react'

${isTs ? `export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}` : ''}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}${isTs ? ': ToggleSwitchProps' : ''}) {
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
`
  await writeComponent('toggleSwitch', 'ToggleSwitch', toggleSwitchCode)

  // 12. Badge
  const badgeCode = `import React from 'react'

${isTs ? `export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}` : ''}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}${isTs ? ': BadgeProps' : ''}) {
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
`
  await writeComponent('badge', 'Badge', badgeCode)
}
