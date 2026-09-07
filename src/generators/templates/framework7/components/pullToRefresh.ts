export function getFramework7PullToRefreshTemplate(isTs: boolean): string {
  return `import React from 'react'

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
`
}
