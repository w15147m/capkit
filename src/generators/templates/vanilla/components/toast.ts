export function getVanillaToastTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { message: string; type?: "info" | "success" | "warning" | "error"; onClose: () => void }' : ''
  return `import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    info: '#0284c7',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
  }[type]

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      paddingTop: 'env(safe-area-inset-top)',
      zIndex: 50,
      width: '90%',
      maxWidth: '360px',
    }}>
      <div style={{
        background: colors,
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
      }}>
        <span>{message}</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>✕</button>
      </div>
    </div>
  )
}
`
}
