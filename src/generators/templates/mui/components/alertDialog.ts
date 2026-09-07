export function getMUIAlertDialogTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }' : ''
  return `import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
`
}
