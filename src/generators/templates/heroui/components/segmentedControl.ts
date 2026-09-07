export function getHeroUISegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'
import { Tabs, Tab } from '@heroui/react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={(k) => onChange(String(k))}
      color="primary"
      fullWidth
    >
      {options.map((opt) => (
        <Tab key={opt} title={opt.charAt(0).toUpperCase() + opt.slice(1)} />
      ))}
    </Tabs>
  )
}
`
}
