export function getDaisyToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <label className="label cursor-pointer justify-between py-2">
      {label && <span className="label-text font-medium">{label}</span>}
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}
`
}
