export function getKonstaNavbarTemplate(isTs: boolean): string {
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
}` : ''}

export default function AppNavbar({
  title,
  subtitle,
  platform = 'web',
  isNative = false,
  darkMode = true,
  onToggleTheme,
  onOpenSidebar,
}${isTs ? ': AppNavbarProps' : ''}) {
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
              {darkMode ? '🌙' : '☀️'}
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
`
}
