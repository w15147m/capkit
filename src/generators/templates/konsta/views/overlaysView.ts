export function getKonstaOverlaysViewTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Block, BlockTitle, Button } from 'konsta/react'

${isTs ? `export interface OverlaysViewProps {
  onShowToast: (msg: string) => void
  onOpenBottomSheet: () => void
  onOpenAlert: () => void
  darkMode: boolean
}` : ''}

export default function OverlaysView({
  onShowToast,
  onOpenBottomSheet,
  onOpenAlert,
  darkMode,
}${isTs ? ': OverlaysViewProps' : ''}) {
  return (
    <div className="space-y-4 pb-4">
      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Toast Notifications
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={() => onShowToast('Operation completed successfully!')}>
          Success Toast
        </Button>
        <Button rounded clear colors={{ text: 'text-amber-500' }} onClick={() => onShowToast('Warning: Check connection')}>
          Warning Toast
        </Button>
      </Block>

      <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
        Modal Dialogs & Sheets
      </BlockTitle>
      <Block className="grid grid-cols-2 gap-2">
        <Button rounded onClick={onOpenBottomSheet}>
          Bottom Sheet
        </Button>
        <Button rounded clear colors={{ text: 'text-rose-500' }} onClick={onOpenAlert}>
          Alert Dialog
        </Button>
      </Block>
    </div>
  )
}
`
}
