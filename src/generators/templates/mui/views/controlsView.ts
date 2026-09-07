export function getMUIControlsViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Box, Divider } from '@mui/material'
import SegmentedControl from '../../components/segmentedControl'
import ToggleSwitch from '../../components/toggleSwitch'
import Badge from '../../components/badge'

export default function ControlsView() {
  const [segment, setSegment] = useState('daily')
  const [push, setPush] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader title="Segmented Tabs" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent>
          <SegmentedControl options={['daily', 'weekly', 'monthly']} selected={segment} onChange={setSegment} />
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardHeader title="Mobile Switches" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent>
          <ToggleSwitch label="Push Notifications" checked={push} onChange={setPush} />
          <Divider sx={{ my: 1 }} />
          <ToggleSwitch label="Haptic Feedback" checked={haptics} onChange={setHaptics} />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Badge color="success">Active</Badge>
        <Badge color="secondary">Pro</Badge>
        <Badge color="warning">Pending</Badge>
      </Box>
    </Box>
  )
}
`
}
