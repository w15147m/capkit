export function getMUISkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Box, Skeleton as MUISkeleton } from '@mui/material'

export default function Skeleton() {
  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <MUISkeleton variant="rectangular" width="100%" height={118} sx={{ borderRadius: 2, mb: 1 }} />
      <MUISkeleton width="60%" height={24} />
      <MUISkeleton width="80%" height={20} />
    </Box>
  )
}
`
}
