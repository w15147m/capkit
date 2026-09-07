export function getIonicAppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; onToggleTheme: () => void; isDark: boolean }' : ''
  return `import React from 'react'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/react'
import { moonOutline, sunnyOutline } from 'ionicons/icons'

export default function AppHeader({ title, onToggleTheme, isDark }${tsType}) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onToggleTheme}>
            <IonIcon slot="icon-only" icon={isDark ? sunnyOutline : moonOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
`
}
