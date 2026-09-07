export function getVanillaBadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; color?: string }' : ''
  return `import React from 'react'

export default function Badge({ children, color = '#38bdf8' }${tsType}) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      background: color,
      color: '#0f172a',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 'bold',
    }}>
      {children}
    </span>
  )
}
`
}
