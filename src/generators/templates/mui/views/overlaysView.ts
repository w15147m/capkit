export function getMUIOverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string, severity?: any) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Box } from '@mui/material'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card elevation={2}>
        <CardHeader title="Feedback & Dialogs" titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Button size="small" variant="contained" color="error" onClick={onShowAlert}>Alert Dialog</Button>
          <Button size="small" variant="contained" color="success" onClick={() => onShowToast('Operation succeeded!', 'success')}>Success</Button>
          <Button size="small" variant="contained" color="warning" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</Button>
          <Button size="small" variant="contained" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardHeader
          title="Loading States"
          titleTypographyProps={{ variant: 'subtitle2' }}
          action={<Button size="small" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle</Button>}
        />
        <CardContent>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </CardContent>
      </Card>
    </Box>
  )
}
`
}
