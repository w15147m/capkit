export function getHeroUIHomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react'
import Badge from '../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <Card className="border border-divider">
        <CardHeader className="flex justify-between items-center pb-2">
          <h2 className="font-bold text-lg text-primary">CapKit HeroUI</h2>
          <Badge color="primary">Mobile UI</Badge>
        </CardHeader>
        <CardBody className="py-2 text-sm text-default-600">
          Tailwind CSS v4 + HeroUI with Framer Motion micro-animations, theme tokens, and safe areas.
        </CardBody>
        <CardFooter className="gap-2">
          <Button size="sm" color="primary" onClick={onOpenSheet}>Bottom Sheet</Button>
          <Button size="sm" variant="bordered" onClick={() => onShowToast('Hello from HeroUI!')}>Show Toast</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
`
}
