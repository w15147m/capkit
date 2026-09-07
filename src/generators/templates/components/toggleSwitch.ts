export function getToggleSwitchTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}` : ''}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}${isTs ? ': ToggleSwitchProps' : ''}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      {(label || description) && (
        <div>
          {label && <p className="font-medium text-sm">{label}</p>}
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={\`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer disabled:opacity-50 \${
          checked ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
        }\`}
      >
        <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform" />
      </button>
    </div>
  )
}
`
}
