export function getMUIHomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import { Card, CardHeader, CardContent, CardActions, Typography, Button, Box } from '@mui/material'
import Badge from '../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader
          title="CapKit Material UI"
          subheader="Google Material Design 3"
          action={<Badge color="primary">Mobile UI</Badge>}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Production-grade Material UI v7 components tailored for mobile touch screens and safe-area insets.
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button size="small" variant="contained" onClick={onOpenSheet}>Action Sheet</Button>
          <Button size="small" variant="outlined" onClick={() => onShowToast('Hello from MUI!')}>Toast</Button>
        </CardActions>
      </Card>
    </Box>
  )
}
`
}
