export function getKonstaHomeViewTemplate(isTs: boolean): string {
  return `import React, { useState } from 'react'
import { Block, BlockTitle, Card, Button } from 'konsta/react'
import SegmentedControl from '../../components/segmentedControl'
import LoadingSpinner from '../../components/loadingSpinner'

${isTs ? `export interface HomeViewProps {
  count: number
  onIncrement: () => void
  onReset: () => void
  darkMode: boolean
  onOpenBottomSheet: () => void
  onShowToast: (msg: string) => void
  isLoadingAsync: boolean
  onTriggerReload: () => void
  isNative: boolean
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
  isNative,
}${isTs ? ': HomeViewProps' : ''}) {
  const [activeSegment, setActiveSegment] = useState${isTs ? '<string>' : ''}('overview')

  return (
    <div className="space-y-4 pb-4">
      {/* Hero Section */}
      <Block className="text-center pt-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
          <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h2 className={\`text-2xl font-bold tracking-tight \${darkMode ? 'text-white' : 'text-slate-900'}\`}>
          Konsta UI Mobile Starter
        </h2>
        <p className={\`text-xs mt-1 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
          Konsta UI &bull; Tailwind CSS v4 &bull; Capacitor {isNative ? 'Native' : 'Web'}
        </p>
      </Block>

      {/* Segmented Tabs */}
      <Block className="my-2">
        <SegmentedControl
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'counter', label: 'Counter' },
            { value: 'async', label: 'Async Demo' },
          ]}
          value={activeSegment}
          onChange={setActiveSegment}
        />
      </Block>

      {/* Segment 1: Overview */}
      {activeSegment === 'overview' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="p-2 space-y-3">
            <h3 className="font-semibold text-sm">Pixel-Perfect Native UI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konsta UI automatically adapts styles to iOS and Material Design while integrating smoothly with Tailwind CSS v4.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button rounded onClick={onOpenBottomSheet}>
                Open Sheet Modal
              </Button>
              <Button rounded clear onClick={() => onShowToast('Toast notification triggered!')}>
                Show Toast
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Segment 2: Interactive Counter */}
      {activeSegment === 'counter' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="flex items-center justify-between p-2">
            <div>
              <p className={\`font-semibold text-sm \${darkMode ? 'text-slate-100' : 'text-slate-900'}\`}>
                State Counter
              </p>
              <p className={\`text-xs \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
                Taps: {count}
              </p>
            </div>
            <div className="flex gap-2">
              <Button rounded onClick={onIncrement}>
                Increment ({count})
              </Button>
              {count > 0 && (
                <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onReset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Segment 3: Async & Preloader */}
      {activeSegment === 'async' && (
        <Card
          className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
          margin="m-4"
        >
          <div className="p-2 space-y-3 text-center">
            <h3 className="font-semibold text-sm">Async Preloader Demo</h3>
            {isLoadingAsync ? (
              <div className="py-4">
                <LoadingSpinner label="Fetching device data…" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Tap below to test async loading state with Konsta Preloader.
                </p>
                <Button rounded onClick={onTriggerReload}>
                  Trigger Async Load
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
`
}
