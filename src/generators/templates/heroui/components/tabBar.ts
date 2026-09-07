export function getHeroUITabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'
import { Badge } from '@heroui/react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'controls', label: 'Controls', icon: '🎛️' },
    { id: 'overlays', label: 'Overlays', icon: '✨', badge: badgeCount },
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
`
}
