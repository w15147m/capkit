export function getVanillaOverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string, type?: any) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import LoadingSpinner from '../components/loadingSpinner'
import Skeleton from '../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#94a3b8' }}>Feedback & Dialogs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button onClick={onShowAlert} style={{ padding: '8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Alert</button>
          <button onClick={() => onShowToast('Success notification!', 'success')} style={{ padding: '8px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Success</button>
          <button onClick={() => onShowToast('Warning notification!', 'warning')} style={{ padding: '8px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Warning</button>
          <button onClick={onOpenSheet} style={{ padding: '8px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Bottom Sheet</button>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '16px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Loading States</h3>
          <button onClick={() => setShowSkeleton(!showSkeleton)} style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Toggle</button>
        </div>
        {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
      </div>
    </div>
  )
}
`
}
