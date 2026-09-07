export function getVanillaBottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#1e293b',
        color: '#f8fafc',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        boxShadow: '0 -10px 25px -5px rgba(0,0,0,0.5)',
        zIndex: 10,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '40px', height: '4px', background: '#475569', borderRadius: '9999px', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
`
}
