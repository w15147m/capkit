export function getHeroUIToastTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { message: string; color?: "primary" | "success" | "warning" | "danger"; onClose: () => void }' : ''
  return `import React, { useEffect } from 'react'
import { Card, CardBody, Button } from '@heroui/react'

export default function Toast({ message, color = 'primary', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pt-[env(safe-area-inset-top)] w-11/12 max-w-sm">
      <Card className="shadow-lg border border-divider">
        <CardBody className="flex flex-row items-center justify-between py-2 px-3 gap-2">
          <span className="text-sm font-medium">{message}</span>
          <Button isIconOnly size="sm" variant="light" onClick={onClose}>✕</Button>
        </CardBody>
      </Card>
    </div>
  )
}
`
}
