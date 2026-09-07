export function getMUISegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      fullWidth
      size="small"
    >
      {options.map((opt) => (
        <ToggleButton key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>
          {opt}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
`
}
