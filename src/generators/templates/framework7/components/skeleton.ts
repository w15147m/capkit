export function getFramework7SkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Card, CardContent, SkeletonBlock } from 'framework7-react'

export default function Skeleton() {
  return (
    <Card>
      <CardContent>
        <SkeletonBlock style={{ height: '100px', marginBottom: '8px' }} />
        <SkeletonBlock style={{ height: '16px', width: '60%', marginBottom: '4px' }} />
        <SkeletonBlock style={{ height: '16px', width: '80%' }} />
      </CardContent>
    </Card>
  )
}
`
}
