export function getKonstaSegmentedTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Segmented, SegmentedButton } from 'konsta/react'

${isTs ? `export interface SegmentOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (val: string) => void
}` : ''}

export default function SegmentedControl({
  options,
  value,
  onChange,
}${isTs ? ': SegmentedControlProps' : ''}) {
  return (
    <Segmented rounded strong>
      {options.map((opt) => (
        <SegmentedButton
          key={opt.value}
          active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </SegmentedButton>
      ))}
    </Segmented>
  )
}
`
}
