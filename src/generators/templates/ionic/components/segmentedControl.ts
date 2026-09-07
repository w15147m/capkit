export function getIonicSegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <IonSegment value={selected} onIonChange={(e) => onChange(String(e.detail.value))}>
      {options.map((opt) => (
        <IonSegmentButton key={opt} value={opt}>
          <IonLabel style={{ textTransform: 'capitalize' }}>{opt}</IonLabel>
        </IonSegmentButton>
      ))}
    </IonSegment>
  )
}
`
}
