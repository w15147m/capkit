import type { ProjectOptions } from '../../types/index.js'

export function getAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ''}
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast${isTs ? ', { ToastType }' : ''} from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import PullToRefresh from './components/pullToRefresh'
import Badge from './components/badge'
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
  const [toastMessage, setToastMessage] = useState${isTs ? '<{ text: string; type: ToastType } | null>' : ''}(null)
  const [isLoadingAsync, setIsLoadingAsync] = useState${isTs ? '<boolean>' : ''}(false)

  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const showToast = (text${isTs ? ': string' : ''}, type${isTs ? ': ToastType' : ''} = 'info') => {
    setToastMessage({ text, type })
  }

  const handleRefresh = async () => {
    setIsLoadingAsync(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoadingAsync(false)
    showToast('Data refreshed successfully!', 'success')
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
      badge: 2,
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
    { id: '1', label: 'Dashboard', icon: '📊', onClick: () => setActiveTab('home') },
    { id: '2', label: 'Component Suite', icon: '🧩', onClick: () => setActiveTab('controls') },
    { id: '3', label: 'Modal Overlays', icon: '📱', onClick: () => setActiveTab('overlays') },
    { id: '4', label: 'Show Alert Dialog', icon: '⚠️', onClick: () => setIsAlertOpen(true) },
  ]

  return (
    <div className={\`min-h-screen transition-colors duration-200 \${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }\`}>
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="CapKit Navigation"
        items={sidebarItems}
        darkMode={darkMode}
      />

      <AlertDialog
        isOpen={isAlertOpen}
        title="Reset State Counter?"
        description="This will reset your current taps counter back to 0."
        confirmText="Reset Now"
        variant="danger"
        onConfirm={() => {
          setCount(0)
          setIsAlertOpen(false)
          showToast('Counter reset to 0', 'warning')
        }}
        onCancel={() => setIsAlertOpen(false)}
        darkMode={darkMode}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="CapKit Mobile Components"
        darkMode={darkMode}
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-400">
            This draggable bottom sheet provides native mobile drawer experiences for menus, filters, and forms.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="primary">Header</Badge>
            <Badge variant="success">TabBar</Badge>
            <Badge variant="warning">Drawer</Badge>
            <Badge variant="danger">AlertDialog</Badge>
            <Badge variant="neutral">PullToRefresh</Badge>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsBottomSheetOpen(false)
              showToast('Action confirmed from BottomSheet', 'success')
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-md active:scale-98"
          >
            Confirm & Close
          </button>
        </div>
      </BottomSheet>

      <AppHeader
        title="${options.projectName}"
        subtitle="Mobile Component Suite"
        platform={platform}
        isNative={isNative}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-md mx-auto px-4 pb-24 pt-4 space-y-5">
          {activeTab === 'home' && (
            <HomeView
              count={count}
              onIncrement={() => {
                setCount((c) => c + 1)
                if ((count + 1) % 5 === 0) showToast(\`Reached \${count + 1} taps! 🎉\`, 'success')
              }}
              onReset={() => setIsAlertOpen(true)}
              darkMode={darkMode}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onShowToast={showToast}
              isLoadingAsync={isLoadingAsync}
              onTriggerReload={handleRefresh}
            />
          )}

          {activeTab === 'controls' && (
            <ControlsView
              darkMode={darkMode}
              onToggleDarkMode={setDarkMode}
              hapticsEnabled={hapticsEnabled}
              onToggleHaptics={(val) => {
                setHapticsEnabled(val)
                showToast(val ? 'Haptics enabled' : 'Haptics disabled', 'info')
              }}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onOpenAlert={() => setIsAlertOpen(true)}
            />
          )}

          {activeTab === 'overlays' && (
            <OverlaysView
              onShowToast={showToast}
              onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
              onOpenAlert={() => setIsAlertOpen(true)}
            />
          )}
        </main>
      </PullToRefresh>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
      />
    </div>
  )
}

export default App
`
}
