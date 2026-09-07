export function getDaisyControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [notifications, setNotifications] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Segmented Tabs</h3>
          <SegmentedControl
            options={['daily', 'weekly', 'monthly']}
            selected={segment}
            onChange={setSegment}
          />
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Mobile Switches</h3>
          <ToggleSwitch label="Push Notifications" checked={notifications} onChange={setNotifications} />
          <div className="divider my-0" />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="primary">Active</Badge>
        <Badge variant="secondary">Pro</Badge>
        <Badge variant="accent">New</Badge>
      </div>
    </div>
  )
}
`
}
