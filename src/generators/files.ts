import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile, writeJson } from '../utils/filesystem.js'
import { generateTailwindComponents } from './tailwindComponents.js'

export async function generateProjectFiles(targetDir: string, options: ProjectOptions): Promise<void> {
  const isTs = options.language === 'ts'
  const ext = isTs ? 'tsx' : 'jsx'
  const configExt = isTs ? 'ts' : 'js'

  // 1. index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${options.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`
  await writeFile(path.join(targetDir, 'index.html'), indexHtml)

  // 2. vite.config
  let viteConfig = ''
  if (options.tailwind) {
    viteConfig = `import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
})
`
  } else {
    viteConfig = `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
`
  }
  await writeFile(path.join(targetDir, `vite.config.${configExt}`), viteConfig)

  // 3. src/main.tsx or main.jsx
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTs ? '!' : ''}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
  await writeFile(path.join(targetDir, 'src', `main.${ext}`), mainContent)

  // 4. src/index.css
  let indexCss = ''
  if (options.tailwind && options.konsta) {
    indexCss = `@import "tailwindcss";
@import "konsta/theme.css";
@source "../node_modules/konsta";

body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`
  } else if (options.tailwind) {
    indexCss = `@import "tailwindcss";

body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`
  } else {
    indexCss = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
`
  }
  await writeFile(path.join(targetDir, 'src', 'index.css'), indexCss)

  // 5. src/App.tsx or App.jsx
  let appContent = ''
  if (options.konsta) {
    appContent = `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ''}
import {
  App as KonstaApp,
  Page,
  Navbar,
  Block,
  BlockTitle,
  Card,
  Button,
  List,
  ListItem,
  Badge,
  Toggle,
} from 'konsta/react'

function App() {
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [darkMode, setDarkMode] = useState${isTs ? '<boolean>' : ''}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? '<boolean>' : ''}(true)

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

  return (
    <div className={darkMode ? 'dark k-dark' : ''}>
      <KonstaApp theme={theme} dark={darkMode} safeAreas className={darkMode ? 'dark k-dark' : ''}>
        <Page className={darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}>
          <Navbar
            title="${options.projectName}"
            subtitle="Capacitor + Konsta"
            className="top-0 sticky"
            right={
              <div className="flex items-center gap-2 pr-2">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-1.5 rounded-full bg-slate-800 text-amber-300"
                  aria-label="Toggle Theme"
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
                <Badge colors={{ bg: isNative ? 'bg-emerald-500' : 'bg-blue-500' }}>
                  {platform.toUpperCase()}
                </Badge>
              </div>
            }
          />

          <Block className="text-center pt-4">
            <h1 className={\`text-2xl font-bold tracking-tight \${darkMode ? 'text-white' : 'text-slate-900'}\`}>
              ${options.projectName}
            </h1>
            <p className={\`text-xs mt-1 \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
              Konsta UI • Tailwind CSS v4 • Capacitor {isNative ? 'Native' : 'Web'}
            </p>
          </Block>

          <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            Interactive State & HMR
          </BlockTitle>
          <Card
            className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}
            margin="m-4"
          >
            <div className="flex items-center justify-between p-2">
              <div>
                <p className={\`font-semibold text-sm \${darkMode ? 'text-slate-100' : 'text-slate-900'}\`}>
                  State Counter
                </p>
                <p className={\`text-xs \${darkMode ? 'text-slate-400' : 'text-slate-500'}\`}>
                  Taps: {count}
                </p>
              </div>
              <Button rounded className="w-auto px-4" onClick={() => setCount((c) => c + 1)}>
                Increment ({count})
              </Button>
            </div>
          </Card>

          <BlockTitle className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            Device & App Settings
          </BlockTitle>
          <List
            strong
            inset
            className={darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}
          >
            <ListItem
              title="Platform"
              after={platform.toUpperCase()}
              text={isNative ? 'Running on physical device' : 'Running in browser'}
            />
            <ListItem
              title="Dark Mode"
              text={darkMode ? 'Pure Dark theme active' : 'Clean Light theme active'}
              onClick={() => setDarkMode(!darkMode)}
              link
              after={
                <Toggle
                  checked={darkMode}
                  onChange={(e${isTs ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => setDarkMode(e.target.checked)}
                />
              }
            />
            <ListItem
              title="Haptics Feedback"
              text={hapticsEnabled ? 'Vibration enabled' : 'Disabled'}
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              link
              after={
                <Toggle
                  checked={hapticsEnabled}
                  onChange={(e${isTs ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => setHapticsEnabled(e.target.checked)}
                />
              }
            />
          </List>
        </Page>
      </KonstaApp>
    </div>
  )
}

export default App
`
  } else if (options.tailwind) {
    await generateTailwindComponents(targetDir, options)

    appContent = `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ''}
import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast${isTs ? ', { ToastType }' : ''} from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import LoadingSpinner from './components/loadingSpinner'
import Skeleton from './components/skeleton'
import SegmentedControl from './components/segmentedControl'
import PullToRefresh from './components/pullToRefresh'
import ToggleSwitch from './components/toggleSwitch'
import Badge from './components/badge'

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? '<string>' : ''}('home')
  const [activeSegment, setActiveSegment] = useState${isTs ? '<string>' : ''}('overview')
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
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Slide-out Navigation Drawer */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="CapKit Navigation"
        items={sidebarItems}
        darkMode={darkMode}
      />

      {/* Alert Dialog Popup */}
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

      {/* Draggable Bottom Sheet */}
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

      {/* Sticky App Header */}
      <AppHeader
        title="${options.projectName}"
        subtitle="Mobile Component Suite"
        platform={platform}
        isNative={isNative}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Main Tab Content with PullToRefresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-md mx-auto px-4 pb-24 pt-4 space-y-5">
          {activeTab === 'home' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Hero Banner */}
              <section className="text-center pt-2">
                <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
                  <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">CapKit Mobile Starter</h2>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Badge variant="primary">React 19</Badge>
                  <Badge variant="success">Capacitor 8</Badge>
                  <Badge variant="warning">Tailwind v4</Badge>
                </div>
              </section>

              {/* Segmented Control */}
              <section>
                <SegmentedControl
                  options={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'interactive', label: 'Counter' },
                    { value: 'async', label: 'Async Demo' },
                  ]}
                  value={activeSegment}
                  onChange={setActiveSegment}
                  darkMode={darkMode}
                />
              </section>

              {/* Segment 1: Overview */}
              {activeSegment === 'overview' && (
                <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }\`}>
                  <h3 className="font-semibold text-sm">Reusable Mobile System</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every component is built modularly under <code className="text-cyan-400">src/components/</code> following clean project structure conventions.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsBottomSheetOpen(true)}
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
                    >
                      Open BottomSheet ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Pull-to-refresh enabled on top!', 'info')}
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700 text-center"
                    >
                      Test Pull-to-Refresh
                    </button>
                  </div>
                </div>
              )}

              {/* Segment 2: Interactive Counter */}
              {activeSegment === 'interactive' && (
                <div className={\`p-4 rounded-2xl border transition-colors flex items-center justify-between \${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }\`}>
                  <div>
                    <p className="font-semibold text-sm">State Counter</p>
                    <p className="text-xs text-slate-400 mt-0.5">Taps: {count}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCount((c) => c + 1)
                        if (count + 1 % 5 === 0) showToast(\`Reached \${count + 1} taps! 🎉\`, 'success')
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                    >
                      Increment ({count})
                    </button>
                    {count > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAlertOpen(true)}
                        className="px-3 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Segment 3: Async & Skeletons */}
              {activeSegment === 'async' && (
                <div className={\`p-4 rounded-2xl border transition-colors space-y-3 \${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }\`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Loading Skeletons Demo</span>
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="text-xs text-cyan-400 font-semibold"
                    >
                      {isLoadingAsync ? 'Loading…' : 'Trigger Reload'}
                    </button>
                  </div>
                  {isLoadingAsync ? (
                    <div className="space-y-2 py-2">
                      <LoadingSpinner size="md" label="Fetching live device state…" />
                      <Skeleton className="h-4 w-3/4" darkMode={darkMode} />
                      <Skeleton className="h-4 w-full" darkMode={darkMode} />
                      <Skeleton className="h-12 w-full" darkMode={darkMode} />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Tap "Trigger Reload" or pull down the page to see the skeleton loader and spinner in action.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Controls Tab */}
          {activeTab === 'controls' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Device & App Settings
                </h3>
                <div className={\`p-4 rounded-2xl border divide-y transition-colors \${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 divide-slate-800/80'
                    : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
                }\`}>
                  <ToggleSwitch
                    label="Dark Mode"
                    description="Switch between dark and light themes"
                    checked={darkMode}
                    onChange={setDarkMode}
                  />
                  <div className="pt-2">
                    <ToggleSwitch
                      label="Haptics Vibration"
                      description="Vibrate device on interactive feedback"
                      checked={hapticsEnabled}
                      onChange={(val) => {
                        setHapticsEnabled(val)
                        showToast(val ? 'Haptics enabled' : 'Haptics disabled', 'info')
                      }}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Modal & Sheet Triggers
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBottomSheetOpen(true)}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    Open BottomSheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAlertOpen(true)}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    Show Alert Dialog
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Overlays Tab */}
          {activeTab === 'overlays' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Toast Notification Triggers
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Success! Operation completed.', 'success')}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    ✓ Success Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Error! Connection failed.', 'error')}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    ✕ Error Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Warning! Low battery detected.', 'warning')}
                    className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    ⚠ Warning Toast
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Info: New update available.', 'info')}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-md active:scale-95"
                  >
                    ℹ Info Toast
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </PullToRefresh>

      {/* Sticky Bottom Tab Bar */}
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
  } else {
    appContent = `import { useState } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ''}

function App() {
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>${options.projectName}</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Platform: {platform.toUpperCase()} {isNative ? '• NATIVE' : '• WEB'}
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
    </div>
  )
}

export default App
`
  }
  await writeFile(path.join(targetDir, 'src', `App.${ext}`), appContent)

  // 6. tsconfig.json (only for TypeScript projects)
  if (isTs) {
    const tsconfig = {
      files: [],
      references: [
        { path: './tsconfig.app.json' },
        { path: './tsconfig.node.json' },
      ],
    }
    await writeJson(path.join(targetDir, 'tsconfig.json'), tsconfig)

    const tsconfigApp = {
      compilerOptions: {
        tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
      },
      include: ['src'],
    }
    await writeJson(path.join(targetDir, 'tsconfig.app.json'), tsconfigApp)

    const tsconfigNode = {
      compilerOptions: {
        tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
        target: 'ES2022',
        lib: ['ES2023'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
      },
      include: ['vite.config.ts'],
    }
    await writeJson(path.join(targetDir, 'tsconfig.node.json'), tsconfigNode)
  }

  // 7. .gitignore
  const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`
  await writeFile(path.join(targetDir, '.gitignore'), gitignore)

  // 8. README.md
  const readmeContent = `# ${options.projectName}

Scaffolded with **[CapKit](https://github.com/w15147m/capkit)** — Interactive Capacitor starter kit.

## 🚀 Tech Stack

- **Framework**: React 19 (${options.language.toUpperCase()})
- **Build Tool**: Vite
${options.tailwind ? '- **Styling**: Tailwind CSS v4\n' : ''}${options.konsta ? '- **Mobile UI Components**: Konsta UI (iOS & Material design)\n' : ''}${options.android ? '- **Native Runtime**: Capacitor 8 (Android)\n' : ''}

---

## 🛠️ Getting Started (Development Server)

### 1. Install Dependencies

\`\`\`bash
${options.packageManager} install
\`\`\`

### 2. Start the Vite Dev Server

\`\`\`bash
npm run dev -- --host
\`\`\`

> **Note**: The \`--host\` flag exposes Vite to your local network on \`http://localhost:5173\`.

---

${options.android ? `## 📱 Running on Android with Live Reload

CapKit is pre-configured with **instant live reload (HMR)** on physical devices and emulators.

### Step 1: Connect your Phone
1. Enable **Developer Options** and **USB Debugging** on your Android device.
2. Connect your phone to your computer via USB.
3. Verify your device is detected:
   \`\`\`bash
   adb devices
   \`\`\`

### Step 2: Forward Ports via ADB Reverse
Reverse the Vite dev server port so the phone can access \`http://localhost:5173\` directly:
\`\`\`bash
adb reverse tcp:5173 tcp:5173
\`\`\`

### Step 3: Run the App on Android
In a separate terminal (while \`npm run dev -- --host\` is running):
\`\`\`bash
npx cap run android
\`\`\`
Or open the native Android project in Android Studio:
\`\`\`bash
npx cap open android
\`\`\`

---

## ⚙️ Capacitor & Android Configuration

- **Live Reload**: \`capacitor.config.json\` is configured to load \`http://localhost:5173\` during development. Any code changes will instantly update on your phone screen.
- **Java 21 Requirement**: Capacitor 8 Android builds require Java 21 JDK. \`android/gradle.properties\` is configured with \`org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64\`.

---

## 📦 Production Build

When you are ready to build a standalone offline release APK:
1. In \`capacitor.config.json\`, remove the \`server\` configuration object.
2. Run \`npm run build\` to produce the web bundle into \`dist/\`.
3. Sync assets to native project:
   \`\`\`bash
   npx cap sync
   \`\`\`
4. Build APK in Android Studio or via Gradle:
   \`\`\`bash
   cd android && ./gradlew assembleRelease
   \`\`\`
` : ''}
`
  await writeFile(path.join(targetDir, 'README.md'), readmeContent)
}
