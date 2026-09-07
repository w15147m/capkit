export function getKonstaLoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Preloader } from 'konsta/react'

${isTs ? `export interface LoadingSpinnerProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}` : ''}

export default function LoadingSpinner({
  label,
}${isTs ? ': LoadingSpinnerProps' : ''}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <Preloader />
      {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    </div>
  )
}
`
}
