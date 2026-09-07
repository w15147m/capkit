export function getSkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  darkMode?: boolean
}` : ''}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  darkMode = true,
}${isTs ? ': SkeletonProps' : ''}) {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  }

  return (
    <div
      className={\`animate-pulse \${variantClasses[variant]} \${
        darkMode ? 'bg-slate-800/80' : 'bg-slate-200'
      } \${className}\`}
    />
  )
}
`
}
