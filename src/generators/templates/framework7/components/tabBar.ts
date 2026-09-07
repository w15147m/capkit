export function getFramework7TabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'
import { Toolbar, Link, Badge } from 'framework7-react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <Toolbar bottom tabbar icons>
      <Link tabLink="#view-home" tabLinkActive={currentTab === 'home'} onClick={() => onChangeTab('home')} text="Home" iconF7="house" />
      <Link tabLink="#view-controls" tabLinkActive={currentTab === 'controls'} onClick={() => onChangeTab('controls')} text="Controls" iconF7="slider_horizontal_3" />
      <Link tabLink="#view-overlays" tabLinkActive={currentTab === 'overlays'} onClick={() => onChangeTab('overlays')} text="Overlays" iconF7="sparkles" badge={badgeCount > 0 ? String(badgeCount) : undefined} badgeColor="red" />
    </Toolbar>
  )
}
`
}
