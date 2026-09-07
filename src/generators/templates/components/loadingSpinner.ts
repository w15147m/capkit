export function getLoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}` : ''}

export default function LoadingSpinner({
  size = 'md',
  label,
}${isTs ? ': LoadingSpinnerProps' : ''}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2.5',
    lg: 'w-10 h-10 border-3',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <div
        className={\`rounded-full border-cyan-500/30 border-t-cyan-400 animate-spin \${sizeClasses[size]}\`}
      />
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    </div>
  )
}
`
}
