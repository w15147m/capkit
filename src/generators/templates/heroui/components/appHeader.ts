export function getHeroUIAppHeaderTemplate(isTs: boolean): string {
  const tsType = isTs ? ': { title: string; onOpenSidebar: () => void; isDark: boolean; onToggleTheme: () => void }' : ''
  return `import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'

export default function AppHeader({ title, onOpenSidebar, isDark, onToggleTheme }${tsType}) {
  return (
    <Navbar className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] border-b border-divider" maxWidth="full">
      <NavbarContent justify="start">
        <Button isIconOnly variant="light" size="sm" onClick={onOpenSidebar} aria-label="Menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </NavbarContent>
      <NavbarBrand justify="center">
        <p className="font-bold text-inherit">{title}</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" size="sm" onClick={onToggleTheme} aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
`
}
