export function getIonicHomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react'
import Badge from '../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle>CapKit Ionic</IonCardTitle>
            <Badge color="primary">Mobile UI</Badge>
          </div>
          <IonCardSubtitle>Cross-Platform Ionic React 8</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Full iOS & Android native-feel components with adaptive styling, gestures, and animations.
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <IonButton expand="block" size="small" onClick={onOpenSheet}>Action Sheet</IonButton>
            <IonButton expand="block" size="small" fill="outline" onClick={() => onShowToast('Hello from Ionic!')}>Toast</IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}
`
}
