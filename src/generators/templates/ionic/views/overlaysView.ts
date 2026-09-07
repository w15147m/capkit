export function getIonicOverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string, color?: string) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Overlays & Dialogs</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <IonButton color="danger" size="small" onClick={onShowAlert}>Alert Dialog</IonButton>
            <IonButton color="success" size="small" onClick={() => onShowToast('Success notification!', 'success')}>Success</IonButton>
            <IonButton color="warning" size="small" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</IonButton>
            <IonButton color="primary" size="small" onClick={onOpenSheet}>Bottom Sheet</IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonCardTitle>Loading States</IonCardTitle>
            <IonButton fill="clear" size="small" onClick={() => setShowSkeleton(!showSkeleton)}>
              Toggle
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </IonCardContent>
      </IonCard>
    </div>
  )
}
`
}
