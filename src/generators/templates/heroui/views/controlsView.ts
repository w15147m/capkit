export function getHeroUIControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import SegmentedControl from '../components/segmentedControl'
import ToggleSwitch from '../components/toggleSwitch'
import Badge from '../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Segmented Tabs</CardHeader>
        <CardBody>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Mobile Switches</CardHeader>
        <CardBody className="divide-y divide-divider">
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Badge color="success">Active</Badge>
        <Badge color="secondary">Pro</Badge>
        <Badge color="warning">Pending</Badge>
      </div>
    </div>
  )
}
`
}
