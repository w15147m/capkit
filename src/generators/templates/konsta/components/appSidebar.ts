export function getKonstaSidebarTemplate(isTs: boolean): string {
  return `import React from 'react'
import { Panel, Block, BlockTitle, List, ListItem, Button } from 'konsta/react'

${isTs ? `export interface SidebarItem {
  id: string
  label: string
  icon?: string
  onClick?: () => void
}

export interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  items: SidebarItem[]
  darkMode?: boolean
}` : ''}

export default function AppSidebar({
  isOpen,
  onClose,
  title = 'Menu',
  items,
  darkMode = true,
}${isTs ? ': AppSidebarProps' : ''}) {
  return (
    <Panel
      side="left"
      opened={isOpen}
      onBackdropClick={onClose}
      className={darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}
    >
      <div className="flex flex-col h-full justify-between p-4 pt-8">
        <div>
          <BlockTitle className="text-xl font-bold">{title}</BlockTitle>
          <List strong inset className={darkMode ? 'bg-slate-800' : 'bg-slate-100'}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.label}
                media={item.icon ? <span>{item.icon}</span> : undefined}
                link
                onClick={() => {
                  item.onClick?.()
                  onClose()
                }}
              />
            ))}
          </List>
        </div>

        <Block>
          <Button rounded onClick={onClose}>
            Close Menu
          </Button>
        </Block>
      </div>
    </Panel>
  )
}
`
}
