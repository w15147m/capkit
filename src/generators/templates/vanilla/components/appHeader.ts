export function getVanillaAppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }' : ''
  return `import React from 'react'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #334155',
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: '16px',
      paddingRight: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <button
          onClick={onOpenSidebar}
          style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '20px', cursor: 'pointer', padding: '8px' }}
          aria-label="Open menu"
        >
          ☰
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{title}</span>
        <button
          onClick={onToggleTheme}
          style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '18px', cursor: 'pointer', padding: '8px' }}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
`
}
