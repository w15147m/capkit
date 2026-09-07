export function getSegmentedControlTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface SegmentOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  darkMode?: boolean
}` : ''}

export default function SegmentedControl({
  options,
  value,
  onChange,
  darkMode = true,
}${isTs ? ': SegmentedControlProps' : ''}) {
  return (
    <div
      className={\`grid grid-flow-col auto-cols-fr p-1 rounded-2xl border transition-colors \${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }\`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={\`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 \${
              isSelected
                ? darkMode
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }\`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
`
}
