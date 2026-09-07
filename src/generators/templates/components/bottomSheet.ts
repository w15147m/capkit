export function getBottomSheetTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  darkMode?: boolean
}` : ''}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  darkMode = true,
}${isTs ? ': BottomSheetProps' : ''}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Sheet Content */}
      <div
        className={\`relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] border-t shadow-2xl z-10 transition-colors \${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }\`}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto mb-4 cursor-grab" onClick={onClose} />

        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
            <h3 className="text-base font-bold tracking-tight">{title}</h3>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
              ✕
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}
`
}
