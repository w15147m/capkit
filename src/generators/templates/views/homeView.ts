export function getHomeViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import Badge from '../../components/badge'
import SegmentedControl from '../../components/segmentedControl'
import Skeleton from '../../components/skeleton'
import LoadingSpinner from '../../components/loadingSpinner'

${isTs ? `export interface HomeViewProps {
  count: number
  onIncrement: () => void
  onReset: () => void
  darkMode: boolean
  onOpenBottomSheet: () => void
  onShowToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void
  isLoadingAsync: boolean
  onTriggerReload: () => void
}` : ''}

export default function HomeView({
  count,
  onIncrement,
  onReset,
  darkMode,
  onOpenBottomSheet,
  onShowToast,
  isLoadingAsync,
  onTriggerReload,
}${isTs ? ': HomeViewProps' : ''}) {
  const [activeSegment, setActiveSegment] = useState${isTs ? '<string>' : ''}('overview')

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <section className="text-center pt-2">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
          <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">CapKit Mobile Starter</h2>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Badge variant="primary">React 19</Badge>
          <Badge variant="success">Capacitor 8</Badge>
          <Badge variant="warning">Tailwind v4</Badge>
        </div>
      </section>

      {/* Segmented Control */}
      <section>
        <SegmentedControl
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'interactive', label: 'Counter' },
            { value: 'async', label: 'Async Demo' },
          ]}
          value={activeSegment}
          onChange={setActiveSegment}
          darkMode={darkMode}
        />
      </section>

      {/* Segment 1: Overview */}
      {activeSegment === 'overview' && (
        <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <h3 className="font-semibold text-sm">Reusable Mobile System</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every component is built modularly under <code className="text-cyan-400">src/components/</code> following clean project structure conventions.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenBottomSheet}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
            >
              Open BottomSheet ↗
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Pull-to-refresh enabled on top!', 'info')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
            >
              Test Pull-to-Refresh
            </button>
          </div>
        </div>
      )}

      {/* Segment 2: Interactive Counter */}
      {activeSegment === 'interactive' && (
        <div className={\`p-4 rounded-2xl border transition-colors flex items-center justify-between \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <div>
            <p className="font-semibold text-sm">State Counter</p>
            <p className="text-xs text-slate-400 mt-0.5">Taps: {count}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onIncrement}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
            >
              Increment ({count})
            </button>
            {count > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Segment 3: Async & Skeletons */}
      {activeSegment === 'async' && (
        <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }\`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Loading Skeletons Demo</span>
            <button
              type="button"
              onClick={onTriggerReload}
              className="text-xs text-cyan-400 font-semibold"
            >
              {isLoadingAsync ? 'Loading…' : 'Trigger Reload'}
            </button>
          </div>
          {isLoadingAsync ? (
            <div className="space-y-2 py-2">
              <LoadingSpinner size="md" label="Fetching live device state…" />
              <Skeleton className="h-4 w-3/4" darkMode={darkMode} />
              <Skeleton className="h-4 w-full" darkMode={darkMode} />
              <Skeleton className="h-12 w-full" darkMode={darkMode} />
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Tap "Trigger Reload" or pull down the page to see the skeleton loader and spinner in action.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
`
}
