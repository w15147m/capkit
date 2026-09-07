export function getMUIAppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 260 }} role="presentation">
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6" fontWeight="bold">CapKit MUI</Typography>
          <Typography variant="caption">Material Design 3</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('home'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>🏠</span></ListItemIcon>
              <ListItemText primary="Home Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('controls'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>🎛️</span></ListItemIcon>
              <ListItemText primary="UI Controls" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { onSelectTab('overlays'); onClose(); }}>
              <ListItemIcon><span style={{ fontSize: '20px' }}>✨</span></ListItemIcon>
              <ListItemText primary="Overlays & Dialogs" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
`
}
