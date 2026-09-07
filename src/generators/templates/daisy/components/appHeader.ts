export function getDaisyAppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; onOpenSidebar: () => void; theme: string; onToggleTheme: () => void }' : ''
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
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
`
}
