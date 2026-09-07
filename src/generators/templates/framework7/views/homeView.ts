export function getFramework7HomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import { Card, CardHeader, CardContent, CardFooter, Button, Block } from 'framework7-react'
import Badge from '../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <Block>
      <Card>
        <CardHeader className="display-flex justify-content-space-between align-items-center">
          <span>CapKit Framework7</span>
          <Badge color="blue">Mobile UI</Badge>
        </CardHeader>
        <CardContent>
          Framework7 native mobile UI engine with built-in iOS & Material Design themes, touch transitions, and safe areas.
        </CardContent>
        <CardFooter>
          <Button fill small onClick={onOpenSheet}>Action Sheet</Button>
          <Button outline small onClick={() => onShowToast('Hello from Framework7!')}>Toast</Button>
        </CardFooter>
      </Card>
    </Block>
  )
}
`
}
