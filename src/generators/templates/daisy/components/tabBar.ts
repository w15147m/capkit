export function getDaisyTabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'controls', label: 'Controls', icon: '🎛️' },
    { id: 'overlays', label: 'Overlays', icon: '✨', badge: badgeCount },
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
`
}
