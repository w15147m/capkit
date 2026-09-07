export function getIonicToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'
import { IonItem, IonLabel, IonToggle } from '@ionic/react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <IonItem lines="full">
      {label && <IonLabel>{label}</IonLabel>}
      <IonToggle checked={checked} onIonChange={(e) => onChange(e.detail.checked)} />
    </IonItem>
  )
}
`
}
