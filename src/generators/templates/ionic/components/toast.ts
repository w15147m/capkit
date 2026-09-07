export function getIonicToastTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; message: string; color?: string; onDidDismiss: () => void }' : ''
  return `import React from 'react'
import { IonToast } from '@ionic/react'

export default function Toast({ isOpen, message, color = 'primary', onDidDismiss }${tsType}) {
  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      duration={3000}
      color={color}
      position="top"
      onDidDismiss={onDidDismiss}
    />
  )
}
`
}
