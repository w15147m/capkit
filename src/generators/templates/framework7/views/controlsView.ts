export function getFramework7ControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import { Block, BlockTitle, Card, CardContent, List } from 'framework7-react'
import SegmentedControl from '../components/segmentedControl'
import ToggleSwitch from '../components/toggleSwitch'
import Badge from '../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <Block>
      <BlockTitle>Segmented Tabs</BlockTitle>
      <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />

      <BlockTitle>Mobile Switches</BlockTitle>
      <Card>
        <List noHairlines>
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </List>
      </Card>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Badge color="green">Active</Badge>
        <Badge color="orange">Pending</Badge>
        <Badge color="blue">Pro</Badge>
      </div>
    </Block>
  )
}
`
}
