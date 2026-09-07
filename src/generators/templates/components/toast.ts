export function getToastTemplate(isTs: boolean): string {
  return `import { useEffect } from 'react'
import { createPortal } from 'react-dom'

${isTs ? `export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  type?: ToastType
  message: string
  duration?: number
  onClose: () => void
}` : ''}

export default function Toast({
  type = 'info',
  message,
  duration = 3000,
  onClose,
}${isTs ? ': ToastProps' : ''}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const typeStyles${isTs ? ': Record<string, string>' : ''} = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-slate-950',
    info: 'bg-blue-600 text-white',
  }

  const icons${isTs ? ': Record<string, string>' : ''} = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return createPortal(
    <div
      className="fixed inset-x-4 z-[9999] flex justify-center pointer-events-none"
      style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
    >
      <div
        className={\`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl font-medium text-xs max-w-sm w-full transition-transform duration-300 translate-y-0 \${
          typeStyles[type]
        }\`}
      >
        <span className="font-bold">{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 font-bold ml-1">
          ✕
        </button>
      </div>
    </div>,
    document.body,
  )
}
`
}
