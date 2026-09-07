import type { ProjectOptions } from '../../../types/index.js'

export function getHeroUIAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import { HeroUIProvider } from '@heroui/react'
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; color?: 'primary' | 'success' | 'warning' | 'danger' } | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const showToast = (message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'primary') => {
    setToast({ message, color })
  }

  return (
    <HeroUIProvider>
      <div className={\`\${isDark ? 'dark' : ''} text-foreground bg-background min-h-screen flex flex-col\`}>
        <AppHeader
          title="${options.projectName}"
          onOpenSidebar={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={(msg) => showToast(msg, 'primary')}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => setAlertOpen(true)}
              onShowToast={showToast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}
        </main>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTab={setCurrentTab}
        />

        {toast && (
          <Toast
            message={toast.message}
            color={toast.color}
            onClose={() => setToast(null)}
          />
        )}

        <AlertDialog
          isOpen={alertOpen}
          title="Confirm Action"
          description="Are you sure you want to proceed with HeroUI modal action?"
          onConfirm={() => {
            setAlertOpen(false)
            showToast('Confirmed!', 'success')
          }}
          onCancel={() => setAlertOpen(false)}
        />

        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="HeroUI Actions"
        >
          <p className="text-sm text-default-600">HeroUI Bottom Sheet with fluid gesture animation.</p>
        </BottomSheet>
      </div>
    </HeroUIProvider>
  )
}
`
}
