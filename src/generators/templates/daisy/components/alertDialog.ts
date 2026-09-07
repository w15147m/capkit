export function getDaisyAlertDialogTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void }' : ''
  return `import React from 'react'

export default function AlertDialog({ isOpen, title, description, onConfirm, onCancel }${tsType}) {
  if (!isOpen) return null

  return (
    <dialog className="modal modal-open z-50">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/80 text-sm">{description}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onCancel}>
        <button>close</button>
      </form>
    </dialog>
  )
}
`
}
