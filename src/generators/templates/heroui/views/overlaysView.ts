export function getHeroUIOverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string, color?: any) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Button } from '@heroui/react'
import LoadingSpinner from '../components/loadingSpinner'
import Skeleton from '../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="font-semibold text-sm">Feedback & Dialogs</CardHeader>
        <CardBody className="grid grid-cols-2 gap-2">
          <Button size="sm" color="danger" onClick={onShowAlert}>Alert Modal</Button>
          <Button size="sm" color="success" onClick={() => onShowToast('Operation succeeded!', 'success')}>Success</Button>
          <Button size="sm" color="warning" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning</Button>
          <Button size="sm" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardHeader className="flex justify-between items-center">
          <span className="font-semibold text-sm">Loading States</span>
          <Button size="sm" variant="light" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle</Button>
        </CardHeader>
        <CardBody>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </CardBody>
      </Card>
    </div>
  )
}
`
}
