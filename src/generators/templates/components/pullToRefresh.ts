export function getPullToRefreshTemplate(isTs: boolean): string {
  return `import React, { useState, useRef } from 'react'

${isTs ? `export interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}` : ''}

export default function PullToRefresh({
  onRefresh,
  children,
}${isTs ? ': PullToRefreshProps' : ''}) {
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = (e${isTs ? ': React.TouchEvent' : ''}) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e${isTs ? ': React.TouchEvent' : ''}) => {
    if (startY.current > 0 && !isRefreshing && window.scrollY === 0) {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current
      if (diff > 0) {
        setPullY(Math.min(diff * 0.4, 70))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (pullY > 50 && !isRefreshing) {
      setIsRefreshing(true)
      setPullY(50)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullY(0)
        startY.current = 0
      }
    } else {
      setPullY(0)
      startY.current = 0
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pullY > 0 && (
        <div
          style={{ height: \`\${pullY}px\` }}
          className="flex items-center justify-center overflow-hidden transition-all text-xs text-cyan-400 font-semibold"
        >
          {isRefreshing ? 'Refreshing…' : pullY > 50 ? 'Release to refresh' : 'Pull down to refresh'}
        </div>
      )}
      {children}
    </div>
  )
}
`
}
