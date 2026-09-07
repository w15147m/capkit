export function getKonstaAlertDialogTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Dialog, DialogButton } from 'konsta/react'

${isTs ? `export interface AlertDialogProps {
  opened: boolean
  title: string
  content?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}` : ''}

export default function AlertDialog({
  opened,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}${isTs ? ': AlertDialogProps' : ''}) {
  return (
    <Dialog
      opened={opened}
      onBackdropClick={onCancel}
      title={title}
      content={content}
      className="z-[100]"
      buttons={
        <>
          <DialogButton onClick={onCancel}>{cancelText}</DialogButton>
          <DialogButton bold onClick={onConfirm}>{confirmText}</DialogButton>
        </>
      }
    />
  )
}
`
}
