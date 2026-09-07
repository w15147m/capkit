export function getFramework7LoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Preloader, Block } from 'framework7-react'

export default function LoadingSpinner() {
  return (
    <Block className="text-align-center">
      <Preloader color="primary" />
    </Block>
  )
}
`
}
