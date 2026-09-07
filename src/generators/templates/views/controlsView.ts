export function getControlsViewTemplate(isTs: boolean): string {
  return `import React from 'react'
import ToggleSwitch from '../../components/toggleSwitch'

${isTs ? `export interface ControlsViewProps {
  darkMode: boolean
  onToggleDarkMode: (val: boolean) => void
  hapticsEnabled: boolean
  onToggleHaptics: (val: boolean) => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
}` : ''}

export default function ControlsView({
  darkMode,
  onToggleDarkMode,
  hapticsEnabled,
  onToggleHaptics,
  onOpenBottomSheet,
  onOpenAlert,
}${isTs ? ': ControlsViewProps' : ''}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Device & App Settings
        </h3>
        <div className={\`p-4 rounded-2xl border divide-y transition-colors \${
          darkMode
            ? 'bg-slate-900 border-slate-800 divide-slate-800/80'
            : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
        }\`}>
          <ToggleSwitch
            label="Dark Mode"
            description="Switch between dark and light themes"
            checked={darkMode}
            onChange={onToggleDarkMode}
          />
          <div className="pt-2">
            <ToggleSwitch
              label="Haptics Vibration"
              description="Vibrate device on interactive feedback"
              checked={hapticsEnabled}
              onChange={onToggleHaptics}
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Modal & Sheet Triggers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Open BottomSheet
          </button>
          <button
            type="button"
            onClick={onOpenAlert}
            className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95 text-center"
          >
            Show Alert Dialog
          </button>
        </div>
      </section>
    </div>
  )
}
`
}
