export function getHeroUISkeletonTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Card, Skeleton as HeroSkeleton } from '@heroui/react'

export default function Skeleton() {
  return (
    <Card className="w-full space-y-3 p-4" radius="lg">
      <HeroSkeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </HeroSkeleton>
      <div className="space-y-2">
        <HeroSkeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </HeroSkeleton>
        <HeroSkeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </HeroSkeleton>
      </div>
    </Card>
  )
}
`
}
