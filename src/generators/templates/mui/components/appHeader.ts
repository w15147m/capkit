export function getMUIAppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }' : ''
  return `import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <AppBar position="sticky" sx={{ pt: 'env(safe-area-inset-top)', zIndex: 1100 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onOpenSidebar} sx={{ mr: 2 }}>
          <span style={{ fontSize: '20px' }}>☰</span>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton color="inherit" onClick={onToggleTheme} aria-label="toggle theme">
          <span>{isDark ? '☀️' : '🌙'}</span>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
`
}
