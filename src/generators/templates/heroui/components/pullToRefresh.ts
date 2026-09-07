export function getHeroUIPullToRefreshTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onRefresh: () => Promise<void>; children: React.ReactNode }' : ''
  return `import React, { useState } from 'react'
import { Button } from '@heroui/react'

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
      <div className="flex justify-center py-2">
        <Button size="sm" variant="flat" color="primary" isLoading={refreshing} onClick={handleRefresh}>
          Pull to Refresh
        </Button>
      </div>
      {children}
    </div>
  )
}
`
}
