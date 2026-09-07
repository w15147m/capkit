import type { ProjectOptions } from '../../../types/index.js'

export function getKonstaAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ''}
import { App as KonstaApp, Page } from 'konsta/react'
import AppNavbar from './components/appNavbar'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? '<string>' : ''}('home')
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [darkMode, setDarkMode] = useState${isTs ? '<boolean>' : ''}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? '<boolean>' : ''}(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState${isTs ? '<boolean>' : ''}(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState${isTs ? '<boolean>' : ''}(false)
  const [isAlertOpen, setIsAlertOpen] = useState${isTs ? '<boolean>' : ''}(false)
  const [toastText, setToastText] = useState${isTs ? '<string>' : ''}('')
  const [isToastOpen, setIsToastOpen] = useState${isTs ? '<boolean>' : ''}(false)
  const [isLoadingAsync, setIsLoadingAsync] = useState${isTs ? '<boolean>' : ''}(false)

  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()
  const theme = platform === 'ios' ? 'ios' : 'material'`
    : `const platform = 'web'
  const isNative = false
  const theme = 'material'`}

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark', 'k-dark')
    } else {
      document.documentElement.classList.remove('dark', 'k-dark')
    }
  }, [darkMode])

  const showToast = (text${isTs ? ': string' : ''}) => {
    setToastText(text)
    setIsToastOpen(true)
  }

  const handleRefresh = async () => {
    setIsLoadingAsync(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoadingAsync(false)
    showToast('Data refreshed successfully!')
  }

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      ),
    },
    {
      id: 'controls',
      label: 'Controls',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      badge: 1,
    },
    {
      id: 'overlays',
      label: 'Overlays',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        </svg>
      ),
    },
  ]

  const sidebarItems = [
    { id: '1', label: 'Home View', icon: '🏠', onClick: () => setActiveTab('home') },
    { id: '2', label: 'Controls View', icon: '⚙️', onClick: () => setActiveTab('controls') },
    { id: '3', label: 'Overlays View', icon: '📱', onClick: () => setActiveTab('overlays') },
  ]

  return (
    <div className={darkMode ? 'dark k-dark' : ''}>
      <KonstaApp theme={theme} dark={darkMode} safeAreas className={darkMode ? 'dark k-dark' : ''}>
        <Page className={darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}>
          {/* Toast Notification */}
          <Toast
            opened={isToastOpen}
            text={toastText}
            onClose={() => setIsToastOpen(false)}
          />

          {/* Sidebar Drawer Panel */}
          <AppSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="CapKit Menu"
            items={sidebarItems}
            darkMode={darkMode}
          />

          {/* Alert Dialog */}
          <AlertDialog
            opened={isAlertOpen}
            title="Reset Counter"
            content="Are you sure you want to reset your taps count to 0?"
            confirmText="Reset"
            cancelText="Cancel"
            onConfirm={() => {
              setCount(0)
              setIsAlertOpen(false)
              showToast('Counter reset to 0')
            }}
            onCancel={() => setIsAlertOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <BottomSheet
            opened={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            title="Konsta UI Components"
            darkMode={darkMode}
          >
            <p className="text-xs text-slate-400 text-center py-2">
              Konsta UI Sheet modal with native animations and safe-area margins.
            </p>
          </BottomSheet>

          {/* Top Navbar */}
          <AppNavbar
            title="${options.projectName}"
            subtitle="Konsta UI + Tailwind"
            platform={platform}
            isNative={isNative}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />

          {/* Tab Views */}
          <main className="max-w-md mx-auto pb-20 pt-2 px-2">
            {activeTab === 'home' && (
              <HomeView
                count={count}
                onIncrement={() => {
                  setCount((c) => c + 1)
                  if ((count + 1) % 5 === 0) showToast(\`Reached \${count + 1} taps! 🎉\`)
                }}
                onReset={() => setIsAlertOpen(true)}
                darkMode={darkMode}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onShowToast={showToast}
                isLoadingAsync={isLoadingAsync}
                onTriggerReload={handleRefresh}
                isNative={isNative}
              />
            )}

            {activeTab === 'controls' && (
              <ControlsView
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                hapticsEnabled={hapticsEnabled}
                onToggleHaptics={() => {
                  setHapticsEnabled(!hapticsEnabled)
                  showToast(!hapticsEnabled ? 'Haptics enabled' : 'Haptics disabled')
                }}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onOpenAlert={() => setIsAlertOpen(true)}
                platform={platform}
                isNative={isNative}
              />
            )}

            {activeTab === 'overlays' && (
              <OverlaysView
                onShowToast={showToast}
                onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
                onOpenAlert={() => setIsAlertOpen(true)}
                darkMode={darkMode}
              />
            )}
          </main>

          {/* Bottom Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Page>
      </KonstaApp>
    </div>
  )
}

export default App
`
}
