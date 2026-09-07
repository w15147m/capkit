export function getVanillaTabBarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { currentTab: string; onChangeTab: (tab: string) => void; badgeCount?: number }' : ''
  return `import React from 'react'

export default function TabBar({ currentTab, onChangeTab, badgeCount = 3 }${tsType}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'controls', label: 'Controls', icon: '🎛️' },
    { id: 'overlays', label: 'Overlays', icon: '✨', badge: badgeCount },
  ]

  return (
    <nav style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid #334155',
      paddingTop: '8px',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
    }}>
      {tabs.map((tab) => {
        const active = currentTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: active ? '#38bdf8' : '#94a3b8',
              fontWeight: active ? 'bold' : 'normal',
              cursor: 'pointer',
              gap: '2px',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {tab.icon}
              {tab.badge ? (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '4px',
                  background: '#38bdf8',
                  color: '#0f172a',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  padding: '2px 6px',
                  fontWeight: 'bold',
                }}>
                  {tab.badge}
                </span>
              ) : null}
            </span>
            <span style={{ fontSize: '11px' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
`
}
