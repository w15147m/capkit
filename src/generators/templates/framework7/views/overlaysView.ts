export function getFramework7OverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import { Block, Card, CardHeader, CardContent, Button, Row, Col } from 'framework7-react'
import LoadingSpinner from '../../components/loadingSpinner'
import Skeleton from '../../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <Block>
      <Card>
        <CardHeader>Feedback & Dialogs</CardHeader>
        <CardContent>
          <Row>
            <Col><Button fill color="red" small onClick={onShowAlert}>Alert</Button></Col>
            <Col><Button fill color="green" small onClick={() => onShowToast('Success notification!')}>Toast</Button></Col>
          </Row>
          <Row style={{ marginTop: '8px' }}>
            <Col><Button fill color="blue" small onClick={onOpenSheet}>Bottom Sheet</Button></Col>
            <Col><Button outline small onClick={() => setShowSkeleton(!showSkeleton)}>Toggle Skeleton</Button></Col>
          </Row>
        </CardContent>
      </Card>

      {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
    </Block>
  )
}
`
}
