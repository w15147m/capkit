export function getVanillaLoadingSpinnerTemplate(isTs: boolean): string {
  return `import React from 'react'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #334155',
        borderTopColor: '#38bdf8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  )
}
`
}
