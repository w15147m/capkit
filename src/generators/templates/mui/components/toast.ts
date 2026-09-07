export function getMUIToastTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { open: boolean; message: string; severity?: "info" | "success" | "warning" | "error"; onClose: () => void }' : ''
  return `import React from 'react'
import { Snackbar, Alert } from '@mui/material'

export default function Toast({ open, message, severity = 'info', onClose }${tsType}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ pt: 'env(safe-area-inset-top)' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
`
}
