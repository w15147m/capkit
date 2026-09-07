export function getMUILoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CircularProgress />
    </Box>
  )
}
`
}
