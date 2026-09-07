export function getHeroUIBadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; color?: "primary" | "secondary" | "success" | "warning" | "danger" }' : ''
  return `import React from 'react'
import { Chip } from '@heroui/react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <Chip color={color} size="sm" variant="flat">{children}</Chip>
}
`
}
