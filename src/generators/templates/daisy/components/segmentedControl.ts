export function getDaisySegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <div className="tabs tabs-box bg-base-200 p-1 rounded-xl w-full flex">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={\`tab flex-1 capitalize text-xs font-semibold \${selected === opt ? 'tab-active bg-primary text-primary-content' : ''}\`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
`
}
