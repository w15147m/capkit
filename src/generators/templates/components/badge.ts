export function getBadgeTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}` : ''}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}${isTs ? ': BadgeProps' : ''}) {
  const variantStyles = {
    primary: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
    success: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-600/20 border-amber-500/30 text-amber-400',
    danger: 'bg-rose-600/20 border-rose-500/30 text-rose-400',
    neutral: 'bg-slate-800 border-slate-700 text-slate-300',
  }

  return (
    <span
      className={\`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide \${
        variantStyles[variant]
      } \${className}\`}
    >
      {children}
    </span>
  )
}
`
}
