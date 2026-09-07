export function getIonicBottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 0.9]}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {children}
      </IonContent>
    </IonModal>
  )
}
`
}
