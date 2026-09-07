export function getFramework7BadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; color?: string }' : ''
  return `import React from 'react'
import { Badge as F7Badge } from 'framework7-react'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <F7Badge color={color}>{children}</F7Badge>
}
`
}
