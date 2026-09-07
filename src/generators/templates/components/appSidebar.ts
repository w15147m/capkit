export function getAppSidebarTemplate(isTs: boolean): string {
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
}
