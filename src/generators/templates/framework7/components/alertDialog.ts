export function getFramework7AlertDialogTemplate(isTs: boolean): string {
  return `import React from 'react'
import { f7 } from 'framework7-react'

export function showFramework7Alert(title: string, text: string, onConfirm?: () => void) {
  if (f7) {
    f7.dialog.confirm(text, title, onConfirm)
  }
}

export default function AlertDialog() {
  return null
}
`
}
