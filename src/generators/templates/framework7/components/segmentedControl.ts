export function getFramework7SegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'
import { Segmented, Button } from 'framework7-react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <Segmented round raised>
      {options.map((opt) => (
        <Button key={opt} active={selected === opt} onClick={() => onChange(opt)}>
          {opt}
        </Button>
      ))}
    </Segmented>
  )
}
`
}
