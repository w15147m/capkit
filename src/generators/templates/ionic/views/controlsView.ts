export function getIonicControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList } from '@ionic/react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div style={{ padding: '12px' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Segmented Tabs</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Mobile Switches</IonCardTitle>
        </IonCardHeader>
        <IonCardContent style={{ padding: 0 }}>
          <IonList>
            <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
            <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
          </IonList>
        </IonCardContent>
      </IonCard>

      <div style={{ display: 'flex', gap: '8px', padding: '0 8px' }}>
        <Badge color="success">Online</Badge>
        <Badge color="warning">Pending</Badge>
        <Badge color="tertiary">Pro</Badge>
      </div>
    </div>
  )
}
`
}
