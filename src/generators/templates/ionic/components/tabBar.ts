export function getIonicTabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react'
import { homeOutline, optionsOutline, sparklesOutline } from 'ionicons/icons'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" selected={currentTab === 'home'} onClick={() => onChangeTab('home')}>
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="controls" selected={currentTab === 'controls'} onClick={() => onChangeTab('controls')}>
        <IonIcon icon={optionsOutline} />
        <IonLabel>Controls</IonLabel>
      </IonTabButton>

      <IonTabButton tab="overlays" selected={currentTab === 'overlays'} onClick={() => onChangeTab('overlays')}>
        <IonIcon icon={sparklesOutline} />
        <IonLabel>Overlays</IonLabel>
        {badgeCount > 0 && <IonBadge color="primary">{badgeCount}</IonBadge>}
      </IonTabButton>
    </IonTabBar>
  )
}
`
}
