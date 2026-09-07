export function getIonicSkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'
import { IonSkeletonText, IonCard, IonCardContent } from '@ionic/react'

export default function Skeleton() {
  return (
    <IonCard>
      <IonCardContent>
        <IonSkeletonText animated style={{ width: '60%', height: '24px', marginBottom: '8px' }} />
        <IonSkeletonText animated style={{ width: '100%', height: '16px', marginBottom: '4px' }} />
        <IonSkeletonText animated style={{ width: '80%', height: '16px' }} />
      </IonCardContent>
    </IonCard>
  )
}
`
}
