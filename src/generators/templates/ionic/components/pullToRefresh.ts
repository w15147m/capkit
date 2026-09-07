export function getIonicPullToRefreshTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onRefresh: () => Promise<void> }' : ''
  return `import React from 'react'
import { IonRefresher, IonRefresherContent } from '@ionic/react'

export default function PullToRefresh({ onRefresh }${tsType}) {
  const handleRefresh = async (event: CustomEvent) => {
    await onRefresh()
    event.detail.complete()
  }

  return (
    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
      <IonRefresherContent pullingText="Pull to refresh..." refreshingSpinner="circles" />
    </IonRefresher>
  )
}
`
}
