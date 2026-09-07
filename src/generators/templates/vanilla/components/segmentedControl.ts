export function getVanillaSegmentedControlTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { options: string[]; selected: string; onChange: (val: string) => void }' : ''
  return `import React from 'react'

export default function SegmentedControl({ options, selected, onChange }${tsType}) {
  return (
    <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '12px', width: '100%' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: selected === opt ? '#38bdf8' : 'transparent',
            color: selected === opt ? '#0f172a' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'capitalize',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
`
}
