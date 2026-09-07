export function getOverlaysViewTemplate(isTs: boolean): string {
  return `import React from 'react'

${isTs ? `export interface OverlaysViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
}` : ''}

export default function OverlaysView({
  onShowToast,
  onOpenBottomSheet,
  onOpenAlert,
}${isTs ? ': OverlaysViewProps' : ''}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Toast Notification Triggers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Success! Operation completed.', 'success')}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            ✓ Success Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Error! Connection failed.', 'error')}
            className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            ✕ Error Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Warning! Low battery detected.', 'warning')}
            className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            ⚠ Warning Toast
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Info: New update available.', 'info')}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            ℹ Info Toast
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Modals & Sheets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open Sheet Modal
          </button>
          <button
            type="button"
            onClick={onOpenAlert}
            className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open Alert Modal
          </button>
        </div>
      </section>
    </div>
  )
}
`
}
