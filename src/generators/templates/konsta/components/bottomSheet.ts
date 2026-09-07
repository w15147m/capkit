export function getKonstaBottomSheetTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Sheet, Block, BlockTitle, Button } from 'konsta/react'

${isTs ? `export interface BottomSheetProps {
  opened: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  darkMode?: boolean
}` : ''}

export default function BottomSheet({
  opened,
  onClose,
  title,
  children,
  darkMode = true,
}${isTs ? ': BottomSheetProps' : ''}) {
  return (
    <Sheet
      opened={opened}
      onBackdropClick={onClose}
      className={\`rounded-t-3xl pb-6 \${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}\`}
    >
      <div className="p-4">
        {title && <BlockTitle className="text-center font-bold text-base mb-2">{title}</BlockTitle>}
        <Block>{children}</Block>
        <div className="mt-4 px-4">
          <Button rounded onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
`
}
