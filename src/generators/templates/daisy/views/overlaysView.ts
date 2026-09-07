export function getDaisyOverlaysViewTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onShowAlert: () => void; onShowToast: (msg: string, type?: any) => void; onOpenSheet: () => void }' : ''
  return `import React, { useState } from 'react'
import LoadingSpinner from '../components/loadingSpinner'
import Skeleton from '../components/skeleton'

export default function OverlaysView({ onShowAlert, onShowToast, onOpenSheet }${tsType}) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-sm">Feedback & Dialogs</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-error btn-sm" onClick={onShowAlert}>Show Alert</button>
            <button className="btn btn-success btn-sm" onClick={() => onShowToast('Operation successful!', 'success')}>Success Toast</button>
            <button className="btn btn-warning btn-sm" onClick={() => onShowToast('Warning triggered!', 'warning')}>Warning Toast</button>
            <button className="btn btn-primary btn-sm" onClick={onOpenSheet}>Bottom Sheet</button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="card-title text-sm">Loading Indicators</h3>
            <button className="btn btn-xs btn-ghost" onClick={() => setShowSkeleton(!showSkeleton)}>
              Toggle Skeleton
            </button>
          </div>
          {showSkeleton ? <Skeleton /> : <LoadingSpinner />}
        </div>
      </div>
    </div>
  )
}
`
}
