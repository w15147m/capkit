export function getAppHeaderTemplate(isTs: boolean): string {
  return `import React from 'react'

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
}
