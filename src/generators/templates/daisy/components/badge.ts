export function getDaisyBadgeTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { children: React.ReactNode; variant?: "primary" | "secondary" | "accent" | "neutral" }' : ''
  return `import React from 'react'

export default function Badge({ children, variant = 'primary' }${tsType}) {
  const variantClass = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    neutral: 'badge-neutral',
  }[variant]

  return <span className={\`badge \${variantClass} font-semibold\`}>{children}</span>
}
`
}
