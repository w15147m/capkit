export function getFramework7BottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { opened: boolean; onBackdropClick: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'
import { Sheet, PageContent, BlockTitle, Block } from 'framework7-react'

export default function BottomSheet({ opened, onBackdropClick, title, children }${tsType}) {
  return (
    <Sheet opened={opened} onSheetClosed={onBackdropClick} swipeToClose backdrop style={{ height: 'auto', maxHeight: '70vh' }}>
      <PageContent>
        <BlockTitle large>{title}</BlockTitle>
        <Block>{children}</Block>
      </PageContent>
    </Sheet>
  )
}
`
}
