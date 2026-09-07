export function getVanillaAppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      <aside style={{
        position: 'relative',
        width: '280px',
        maxWidth: '80vw',
        background: '#1e293b',
        color: '#f8fafc',
        height: '100%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>CapKit App</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', flex: 1 }}>
          <button onClick={() => { onSelectTab('home'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>🏠</span> Home Dashboard
          </button>
          <button onClick={() => { onSelectTab('controls'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>🎛️</span> UI Controls
          </button>
          <button onClick={() => { onSelectTab('overlays'); onClose(); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
            <span>✨</span> Overlays & Dialogs
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #334155' }}>
          CapKit • Mobile Ready
        </div>
      </aside>
    </div>
  )
}
`
}
