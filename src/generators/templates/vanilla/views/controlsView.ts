export function getVanillaControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Segmented Tabs</h3>
        <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
      </div>

      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Mobile Switches</h3>
        <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
        <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />
        <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Badge color="#4ade80">Active</Badge>
        <Badge color="#fbbf24">Pending</Badge>
        <Badge color="#c084fc">Pro</Badge>
      </div>
    </div>
  )
}
`
}
