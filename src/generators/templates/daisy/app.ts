import type { ProjectOptions } from '../../../types/index.js'

export function getDaisyAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
${options.android ? `import { Capacitor } from '@capacitor/core'` : ''}

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? '<string>' : ''}('home')
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [toastMsg, setToastMsg] = useState${isTs ? '<string | null>' : ''}(null)
  const [alertOpen, setAlertOpen] = useState${isTs ? '<boolean>' : ''}(false)

  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  const showToast = (msg${isTs ? ': string' : ''}) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  return (
    <div className="min-h-svh bg-base-300 flex flex-col" data-theme="dim">
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-30">
        <div className="navbar-center flex-1">
          <span className="text-xl font-bold">${options.projectName}</span>
        </div>
        <div className="navbar-end pr-4">
          <div className="badge badge-primary badge-sm">{platform.toUpperCase()}</div>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-4">
        {activeTab === 'home' && (
          <>
            <div className="stats stats-horizontal shadow w-full bg-base-100">
              <div className="stat">
                <div className="stat-title">Taps</div>
                <div className="stat-value text-primary">{count}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Platform</div>
                <div className="stat-value text-secondary text-lg">{platform}</div>
                <div className="stat-desc">{isNative ? 'Native' : 'Web'}</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title">Welcome to CapKit</h2>
                <p className="text-sm text-base-content/70">Built with DaisyUI + Tailwind CSS v4.</p>
                <div className="card-actions justify-end mt-2">
                  <button className="btn btn-primary" onClick={() => { setCount(c => c + 1); showToast(\`Tapped \${count + 1} times!\`) }}>Tap me!</button>
                  <button className="btn btn-outline btn-error" onClick={() => setAlertOpen(true)}>Reset</button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">DaisyUI</span>
              <span className="badge badge-secondary">Tailwind v4</span>
              <span className="badge badge-accent">Capacitor</span>
            </div>
          </>
        )}

        {activeTab === 'ui' && (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body gap-3">
              <h2 className="card-title">Components</h2>
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary btn-sm">Primary</button>
                <button className="btn btn-secondary btn-sm">Secondary</button>
                <button className="btn btn-accent btn-sm">Accent</button>
                <button className="btn btn-ghost btn-sm">Ghost</button>
              </div>
              <progress className="progress progress-primary w-full" value="70" max="100" />
              <div className="flex items-center gap-3">
                <span className="text-sm">Toggle</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            <div role="alert" className="alert alert-success"><span>Success alert.</span></div>
            <div role="alert" className="alert alert-warning"><span>Warning alert.</span></div>
            <div role="alert" className="alert alert-error"><span>Error alert.</span></div>
            <button className="btn btn-primary w-full" onClick={() => showToast('DaisyUI toast! 🌼')}>Show Toast</button>
          </div>
        )}
      </main>

      {toastMsg && (
        <div className="toast toast-top toast-center z-[9999]">
          <div className="alert alert-info shadow-lg"><span>{toastMsg}</span></div>
        </div>
      )}

      {alertOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reset counter?</h3>
            <p className="py-4 text-sm">This will reset your tap count back to 0.</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setAlertOpen(false)}>Cancel</button>
              <button className="btn btn-error" onClick={() => { setCount(0); setAlertOpen(false); showToast('Reset!') }}>Reset</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setAlertOpen(false)} />
        </dialog>
      )}

      <div className="btm-nav btm-nav-sm bg-base-100 border-t border-base-300 z-30">
        <button className={activeTab === 'home' ? 'active text-primary' : ''} onClick={() => setActiveTab('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="btm-nav-label">Home</span>
        </button>
        <button className={activeTab === 'ui' ? 'active text-primary' : ''} onClick={() => setActiveTab('ui')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zm0 10h8v8h-8zM3 13h8v8H3z"/></svg>
          <span className="btm-nav-label">UI Kit</span>
        </button>
        <button className={activeTab === 'alerts' ? 'active text-primary' : ''} onClick={() => setActiveTab('alerts')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span className="btm-nav-label">Alerts</span>
        </button>
      </div>
    </div>
  )
}

export default App
`
}
