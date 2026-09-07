export function getDaisyAppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Drawer Content */}
      <aside className="relative w-72 max-w-[80vw] bg-base-200 h-full p-4 flex flex-col shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 className="text-xl font-bold text-primary">CapKit Daisy</h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        <ul className="menu menu-md py-4 gap-1 flex-1">
          <li>
            <button onClick={() => { onSelectTab('home'); onClose(); }}>
              <span>🏠</span> Home Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => { onSelectTab('controls'); onClose(); }}>
              <span>🎛️</span> UI Controls
            </button>
          </li>
          <li>
            <button onClick={() => { onSelectTab('overlays'); onClose(); }}>
              <span>✨</span> Overlays & Feedback
            </button>
          </li>
        </ul>

        <div className="pt-4 border-t border-base-300 text-xs text-base-content/60 text-center">
          CapKit • Mobile Ready
        </div>
      </aside>
    </div>
  )
}
`
}
