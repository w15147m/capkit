export function getKonstaControlsViewTemplate(isTs: boolean): string {
  return `import React from 'react'
import { BlockTitle, List, ListItem, Toggle, Button, Block } from 'konsta/react'

${isTs ? `export interface ControlsViewProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  hapticsEnabled: boolean
  onToggleHaptics: () => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
  platform: string
  isNative: boolean
}` : ''}

export default function ControlsView({
  darkMode,
  onToggleDarkMode,
  hapticsEnabled,
  onToggleHaptics,
  onOpenBottomSheet,
  onOpenAlert,
  platform,
  isNative,
}${isTs ? ': ControlsViewProps' : ''}) {
  return (
    <div className="space-y-4 pb-4">
      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Device & App Settings
      </BlockTitle>
      <List
        strong
        inset
        className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}
      >
        <ListItem
          title="Platform"
          after={platform.toUpperCase()}
          text={isNative ? 'Running on physical device' : 'Running in browser'}
        />
        <ListItem
          title="Dark Mode"
          text={darkMode ? 'Pure Dark theme active' : 'Clean Light theme active'}
          onClick={onToggleDarkMode}
          link
          after={<Toggle checked={darkMode} onChange={onToggleDarkMode} />}
        />
        <ListItem
          title="Haptics Feedback"
          text={hapticsEnabled ? 'Vibration enabled' : 'Disabled'}
          onClick={onToggleHaptics}
          link
          after={<Toggle checked={hapticsEnabled} onChange={onToggleHaptics} />}
        />
      </List>

      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Modals & Overlays
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={onOpenBottomSheet}>
          Open Sheet
        </Button>
        <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onOpenAlert}>
          Show Dialog
        </Button>
      </Block>
    </div>
  )
}
`
}
