export function getIonicLoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'
import { IonSpinner } from '@ionic/react'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
      <IonSpinner name="crescent" color="primary" />
    </div>
  )
}
`
}
