export function getMUIBottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'
import { Drawer, Box, Typography, IconButton } from '@mui/material'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 'calc(1rem + env(safe-area-inset-bottom))' } }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ width: 40, height: 4, bgcolor: 'grey.400', borderRadius: 2, mx: 'auto', mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton size="small" onClick={onClose}>✕</IconButton>
        </Box>
        {children}
      </Box>
    </Drawer>
  )
}
`
}
