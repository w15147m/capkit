export function getVanillaAlertDialogTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }' : ''
  return `import React from 'react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} onClick={onCancel} />
      <div style={{
        position: 'relative',
        background: '#1e293b',
        color: '#f8fafc',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '12px', marginBottom: '24px' }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #475569', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
`
}
