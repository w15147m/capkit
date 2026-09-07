export function getFramework7AppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; isDark: boolean; onToggleTheme: () => void }' : ''
  return `import React from 'react'
import { Navbar, NavLeft, NavTitle, NavRight, Link } from 'framework7-react'

export default function AppHeader({ title, isDark, onToggleTheme }${tsType}) {
  return (
    <Navbar>
      <NavLeft>
        <Link panelOpen="left" iconF7="bars" />
      </NavLeft>
      <NavTitle>{title}</NavTitle>
      <NavRight>
        <Link onClick={onToggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </Link>
      </NavRight>
    </Navbar>
  )
}
`
}
