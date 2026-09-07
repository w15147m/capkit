export function getIonicAppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, menuController } from '@ionic/react'
import { homeOutline, optionsOutline, sparklesOutline } from 'ionicons/icons'

export default function AppSidebar({ onSelectTab }${tsType}) {
  const handleSelect = async (tab: string) => {
    onSelectTab(tab)
    await menuController.close()
  }

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>CapKit Ionic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => handleSelect('home')}>
            <IonIcon slot="start" icon={homeOutline} />
            <IonLabel>Home Dashboard</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleSelect('controls')}>
            <IonIcon slot="start" icon={optionsOutline} />
            <IonLabel>UI Controls</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleSelect('overlays')}>
            <IonIcon slot="start" icon={sparklesOutline} />
            <IonLabel>Overlays & Dialogs</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}
`
}
