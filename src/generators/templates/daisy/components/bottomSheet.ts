export function getDaisyBottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full bg-base-100 rounded-t-3xl p-6 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-10 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
`
}
