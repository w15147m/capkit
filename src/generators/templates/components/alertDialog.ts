export function getAlertDialogTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface AlertDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
  darkMode?: boolean
}` : ''}

export default function AlertDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  darkMode = true,
}${isTs ? ': AlertDialogProps' : ''}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />

      {/* Dialog Card */}
      <div
        className={\`relative w-full max-w-xs rounded-3xl p-5 shadow-2xl border transition-all z-10 \${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }\`}
      >
        <h3 className="text-base font-bold text-center tracking-tight">{title}</h3>
        {description && (
          <p className={\`text-xs text-center mt-1.5 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
            {description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={\`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors \${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }\`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={\`py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-md transition-colors \${
              variant === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-blue-600 hover:bg-blue-500'
            }\`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
`
}
