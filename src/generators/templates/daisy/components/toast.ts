export function getDaisyToastTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { message: string; type?: "info" | "success" | "warning" | "error"; onClose: () => void }' : ''
  return `import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }${tsType}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const alertClass = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  }[type]

  return (
    <div className="toast toast-top toast-center z-50 pt-[env(safe-area-inset-top)]">
      <div className={\`alert \${alertClass} shadow-lg text-sm flex items-center justify-between min-w-[280px]\`}>
        <span>{message}</span>
        <button onClick={onClose} className="btn btn-xs btn-ghost">✕</button>
      </div>
    </div>
  )
}
`
}
