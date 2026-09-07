export function getVanillaToggleSwitchTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { checked: boolean; onChange: (val: boolean) => void; label?: string }' : ''
  return `import React from 'react'

export default function ToggleSwitch({ checked, onChange, label }${tsType}) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
      {label && <span style={{ fontSize: '14px', color: '#f8fafc' }}>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '20px', height: '20px', accentColor: '#38bdf8', cursor: 'pointer' }}
      />
    </label>
  )
}
`
}
