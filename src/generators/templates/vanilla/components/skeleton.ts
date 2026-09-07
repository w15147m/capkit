export function getVanillaSkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'

export default function Skeleton() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <div style={{ height: '96px', background: '#334155', borderRadius: '12px', opacity: 0.6 }} />
      <div style={{ height: '16px', width: '60%', background: '#334155', borderRadius: '6px', opacity: 0.6 }} />
      <div style={{ height: '16px', width: '80%', background: '#334155', borderRadius: '6px', opacity: 0.6 }} />
    </div>
  )
}
`
}
