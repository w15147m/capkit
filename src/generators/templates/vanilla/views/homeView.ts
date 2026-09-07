export function getVanillaHomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import Badge from '../../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>CapKit Mobile</h2>
          <Badge>Starter</Badge>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
          Pure modular responsive mobile UI components with safe-area insets, interactive drawers, tabs, and alerts.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={onOpenSheet} style={{ padding: '8px 16px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
            Action Sheet
          </button>
          <button onClick={() => onShowToast('Hello from CapKit!')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #475569', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
            Toast
          </button>
        </div>
      </div>
    </div>
  )
}
`
}
