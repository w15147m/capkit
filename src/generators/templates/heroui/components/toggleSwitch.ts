export function getHeroUIToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'
import { Switch } from '@heroui/react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <div className="flex items-center justify-between py-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <Switch isSelected={checked} onValueChange={onChange} color="primary" />
    </div>
  )
}
`
}
