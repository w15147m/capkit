export function getIonicBadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; color?: string }' : ''
  return `import React from 'react'
import { IonChip, IonLabel } from '@ionic/react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return (
    <IonChip color={color}>
      <IonLabel>{children}</IonLabel>
    </IonChip>
  )
}
`
}
