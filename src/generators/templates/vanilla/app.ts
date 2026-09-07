import type { ProjectOptions } from '../../../types/index.js'

export function getVanillaAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
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
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' | 'error' } | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ message, type })
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#0f172a', color: '#f8fafc' }}>
      <AppHeader
        title="${options.projectName}"
        onOpenSidebar={() => setSidebarOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {currentTab === 'home' && (
          <HomeView
            onOpenSheet={() => setSheetOpen(true)}
            onShowToast={(msg) => showToast(msg, 'info')}
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
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={alertOpen}
        title="Confirm Operation"
        description="Are you sure you want to perform this operation?"
        onConfirm={() => {
          setAlertOpen(false)
          showToast('Confirmed successfully!', 'success')
        }}
        onCancel={() => setAlertOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Action Sheet"
      >
        <button
          onClick={() => {
            setSheetOpen(false)
            showToast('Item shared!', 'success')
          }}
          style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Share Content
        </button>
      </BottomSheet>
    </div>
  )
}
`
}
