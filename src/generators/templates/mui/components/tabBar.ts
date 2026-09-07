export function getMUITabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, pb: 'env(safe-area-inset-bottom)', zIndex: 1000 }} elevation={4}>
      <BottomNavigation
        showLabels
        value={currentTab}
        onChange={(_, newValue) => onChangeTab(newValue)}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<span style={{ fontSize: '20px' }}>🏠</span>}
        />
        <BottomNavigationAction
          label="Controls"
          value="controls"
          icon={<span style={{ fontSize: '20px' }}>🎛️</span>}
        />
        <BottomNavigationAction
          label="Overlays"
          value="overlays"
          icon={
            <Badge badgeContent={badgeCount} color="primary">
              <span style={{ fontSize: '20px' }}>✨</span>
            </Badge>
          }
        />
      </BottomNavigation>
    </Paper>
  )
}
`
}
