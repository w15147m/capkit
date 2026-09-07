export function getDaisyPullToRefreshTemplate(isTs: boolean): string {
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
    <div className="relative">
      <div className="flex justify-center py-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-xs btn-outline btn-primary gap-1"
        >
          {refreshing ? <span className="loading loading-spinner loading-xs" /> : '↓'} Pull to Refresh
        </button>
      </div>
      {children}
    </div>
  )
}
`
}
