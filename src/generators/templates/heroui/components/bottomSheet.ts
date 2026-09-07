export function getHeroUIBottomSheetTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }' : ''
  return `import React from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react'

export default function BottomSheet({ isOpen, onClose, title, children }${tsType}) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="bottom" size="md">
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        {() => (
          <>
            <DrawerHeader className="border-b border-divider">{title}</DrawerHeader>
            <DrawerBody className="py-4">{children}</DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
`
}
