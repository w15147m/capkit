export function getFramework7ToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'
import { ListItem, Toggle } from 'framework7-react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <ListItem title={label}>
      <Toggle checked={checked} onToggleChange={onChange} slot="after" color="primary" />
    </ListItem>
  )
}
`
}
