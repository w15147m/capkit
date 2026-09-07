import type { ProjectOptions } from '../../../types/index.js'

export function getIonicAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import { IonApp, IonContent, setupIonicReact } from '@ionic/react'
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import Toast from './components/toast'
import AlertDialog from './components/alertDialog'
import BottomSheet from './components/bottomSheet'
import PullToRefresh from './components/pullToRefresh'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

setupIonicReact({ mode: 'md' })

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; color?: string }>({ isOpen: false, message: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.body.classList.toggle('dark', !isDark)
  }

  const showToast = (message: string, color: string = 'primary') => {
    setToast({ isOpen: true, message, color })
  }

  return (
    <IonApp>
      <AppSidebar onSelectTab={setCurrentTab} />

      <div className="ion-page" id="main-content">
        <AppHeader
          title="${options.projectName}"
          onToggleTheme={toggleTheme}
          isDark={isDark}
        />

        <IonContent fullscreen>
          <PullToRefresh onRefresh={async () => {
            await new Promise((res) => setTimeout(res, 1500))
            showToast('Refreshed!', 'success')
          }} />

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
        </IonContent>

        <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />
      </div>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        color={toast.color}
        onDidDismiss={() => setToast({ isOpen: false, message: '' })}
      />

      <AlertDialog
        isOpen={alertOpen}
        title="Confirm Operation"
        description="Are you sure you want to trigger this action in Ionic?"
        onConfirm={() => {
          setAlertOpen(false)
          showToast('Confirmed successfully!', 'success')
        }}
        onCancel={() => setAlertOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Ionic Action Sheet"
      >
        <p>This is a native Ionic bottom sheet modal with multiple snap points.</p>
      </BottomSheet>
    </IonApp>
  )
}
`
}
