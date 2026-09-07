export function getHeroUIAppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { isOpen: boolean; onClose: () => void; onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from '@heroui/react'

export default function AppSidebar({ isOpen, onClose, onSelectTab }${tsType}) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="left" size="xs">
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
              <span className="text-primary font-bold">CapKit HeroUI</span>
            </DrawerHeader>
            <DrawerBody className="gap-2 py-4">
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('home'); onClose(); }}>
                🏠 Home Dashboard
              </Button>
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('controls'); onClose(); }}>
                🎛️ UI Controls
              </Button>
              <Button variant="light" className="justify-start" onClick={() => { onSelectTab('overlays'); onClose(); }}>
                ✨ Overlays & Dialogs
              </Button>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
`
}
