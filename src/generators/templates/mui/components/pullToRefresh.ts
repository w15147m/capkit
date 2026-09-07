export function getMUIPullToRefreshTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onRefresh: () => Promise<void>; children: React.ReactNode }' : ''
  return `import React, { useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Button size="small" variant="outlined" disabled={refreshing} onClick={handleRefresh}>
          {refreshing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : '↓ '} Pull to Refresh
        </Button>
      </Box>
      {children}
    </Box>
  )
}
`
}
