import type { ProjectOptions } from '../../../types/index.js'

export function getMUIAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material'
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
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [currentTab, setCurrentTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'info' | 'success' | 'warning' | 'error' }>({ open: false, message: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#3b82f6' },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
      }),
    [mode]
  )

  const showToast = (message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ open: true, message, severity })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <AppHeader
          title="${options.projectName}"
          onOpenSidebar={() => setSidebarOpen(true)}
          isDark={mode === 'dark'}
          onToggleTheme={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <Box component="main" sx={{ flexGrow: 1, pb: 10, overflowY: 'auto' }}>
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
        </Box>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />

        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTab={setCurrentTab}
        />

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        />

        <AlertDialog
          isOpen={alertOpen}
          title="Confirm Action"
          description="Are you sure you want to perform this Material UI operation?"
          onConfirm={() => {
            setAlertOpen(false)
            showToast('Confirmed successfully!', 'success')
          }}
          onCancel={() => setAlertOpen(false)}
        />

        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Material Actions"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <button
              style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => {
                setSheetOpen(false)
                showToast('Shared successfully!', 'success')
              }}
            >
              Share Item
            </button>
          </Box>
        </BottomSheet>
      </Box>
    </ThemeProvider>
  )
}
`
}
