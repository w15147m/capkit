import { useState } from 'react'
import { Capacitor } from '@capacitor/core'

function App() {
  const [count, setCount] = useState(0)
  const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 font-sans">
      {/* Top Header Badge */}
      <div className="w-full max-w-md pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Capacitor Starter
          </span>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
            isNative
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
          }`}
        >
          {platform.toUpperCase()} {isNative ? '• NATIVE' : '• WEB'}
        </span>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-md my-6 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl shadow-xl shadow-cyan-950/50 mb-6">
          <svg
            className="w-16 h-16 text-cyan-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          React + Capacitor
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Tailwind CSS v4 &bull; Vite HMR &bull; Android Ready
        </p>
      </div>

      {/* Interactive Counter Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm mb-5">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-base font-semibold text-slate-200">Interactive State</h2>
            <p className="text-xs text-slate-400">Test React reactivity & HMR</p>
          </div>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-md active:scale-95 transition-all"
          >
            Count: {count}
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="w-full max-w-md space-y-3">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-200">Live Reload Active</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit <code className="text-cyan-300 font-mono">src/App.jsx</code> and see changes instantly on your phone.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-200">Ready for CLI Starter Kit</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This setup will be packaged into our interactive <code className="text-indigo-300 font-mono">create-capacitor-app</code> CLI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

