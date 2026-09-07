export function getKonstaTabBarTemplate(isTs: boolean): string {
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
}` : ''}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
}${isTs ? ': TabBarProps' : ''}) {
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
`
}
