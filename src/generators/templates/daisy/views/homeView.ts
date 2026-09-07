export function getDaisyHomeViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onOpenSheet: () => void; onShowToast: (msg: string) => void }' : ''
  return `import React from 'react'
import Badge from '../components/badge'

export default function HomeView({ onOpenSheet, onShowToast }${tsType}) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-primary">CapKit Daisy</h2>
            <Badge variant="primary">Mobile UI</Badge>
          </div>
          <p className="text-sm text-base-content/80">
            Tailwind CSS v4 + DaisyUI semantic components configured with safe-area insets.
          </p>
          <div className="card-actions justify-end mt-2">
            <button className="btn btn-primary btn-sm" onClick={onOpenSheet}>Open Action Sheet</button>
            <button className="btn btn-outline btn-sm" onClick={() => onShowToast('Hello from DaisyUI!')}>Toast</button>
          </div>
        </div>
      </div>
    </div>
  )
}
`
}
