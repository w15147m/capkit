export function getDaisySkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'

export default function Skeleton() {
  return (
    <div className="flex flex-col gap-3 w-full p-4">
      <div className="skeleton h-32 w-full rounded-2xl"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-3/4"></div>
    </div>
  )
}
`
}
