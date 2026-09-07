export function getVanillaPullToRefreshTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onRefresh: () => Promise<void>; children: React.ReactNode }' : ''
  return `import React, { useState } from 'react'

export default function PullToRefresh({ onRefresh, children }${tsType}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ padding: '4px 12px', background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '9999px', fontSize: '12px', cursor: 'pointer' }}
        >
          {refreshing ? 'Refreshing...' : '↓ Pull to Refresh'}
        </button>
      </div>
      {children}
    </div>
  )
}
`
}
