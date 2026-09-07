export function getIonicAlertDialogTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }' : ''
  return `import React from 'react'
import { IonAlert } from '@ionic/react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  return (
    <IonAlert
      isOpen={isOpen}
      header={title}
      message={description}
      buttons={[
        { text: 'Cancel', role: 'cancel', handler: onCancel },
        { text: 'Confirm', role: 'confirm', handler: onConfirm },
      ]}
      onDidDismiss={onCancel}
    />
  )
}
`
}
