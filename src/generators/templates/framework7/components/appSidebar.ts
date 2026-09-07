export function getFramework7AppSidebarTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { onSelectTab: (tab: string) => void }' : ''
  return `import React from 'react'
import { Panel, Page, Navbar, List, ListItem } from 'framework7-react'

export default function AppSidebar({ onSelectTab }${tsType}) {
  return (
    <Panel left cover>
      <Page>
        <Navbar title="CapKit Framework7" />
        <List menuList>
          <ListItem link title="Home Dashboard" panelClose onClick={() => onSelectTab('home')} />
          <ListItem link title="UI Controls" panelClose onClick={() => onSelectTab('controls')} />
          <ListItem link title="Overlays & Dialogs" panelClose onClick={() => onSelectTab('overlays')} />
        </List>
      </Page>
    </Panel>
  )
}
`
}
