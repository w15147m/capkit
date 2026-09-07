export function getHeroUILoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Spinner } from '@heroui/react'

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center p-4">
      <Spinner color="primary" />
    </div>
  )
}
`
}
