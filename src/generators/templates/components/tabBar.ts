export function getTabBarTemplate(isTs: boolean): string {
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
}
