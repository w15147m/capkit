export function getMUIBadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; color?: "primary" | "secondary" | "success" | "warning" | "error" }' : ''
  return `import React from 'react'
import { Chip } from '@mui/material'

export default function Badge({ children, color = 'primary' }${tsType}) {
  return <Chip label={children} color={color} size="small" />
}
`
}
