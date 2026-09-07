import type { ProjectOptions } from '../../../types/index.js'

export function getFramework7AppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import Framework7 from 'framework7/lite-bundle'
import Framework7React, { App, View, Page } from 'framework7-react'
import 'framework7/css/bundle'

import AppHeader from './components/appHeader'
import TabBar from './components/tabBar'
import AppSidebar from './components/appSidebar'
import BottomSheet from './components/bottomSheet'
import { showFramework7Toast } from './components/toast'
import { showFramework7Alert } from './components/alertDialog'
import HomeView from './views/homeView'
import ControlsView from './views/controlsView'
import OverlaysView from './views/overlaysView'

Framework7.use(Framework7React)

export default function MainApp() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isDark, setIsDark] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark', !isDark)
  }

  return (
    <App theme="auto" name="${options.projectName}" dark={isDark}>
      <AppSidebar onSelectTab={setCurrentTab} />

      <View main className="safe-areas">
        <Page ptr onPtrRefresh={(done) => {
          setTimeout(() => {
            showFramework7Toast('Refreshed!')
            done()
          }, 1500)
        }}>
          <AppHeader
            title="${options.projectName}"
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {currentTab === 'home' && (
            <HomeView
              onOpenSheet={() => setSheetOpen(true)}
              onShowToast={showFramework7Toast}
            />
          )}
          {currentTab === 'controls' && <ControlsView />}
          {currentTab === 'overlays' && (
            <OverlaysView
              onShowAlert={() => showFramework7Alert('Confirm Action', 'Are you sure you want to proceed in Framework7?')}
              onShowToast={showFramework7Toast}
              onOpenSheet={() => setSheetOpen(true)}
            />
          )}

          <TabBar currentTab={currentTab} onChangeTab={setCurrentTab} badgeCount={3} />
        </Page>
      </View>

      <BottomSheet
        opened={sheetOpen}
        onBackdropClick={() => setSheetOpen(false)}
        title="Framework7 Action Sheet"
      >
        <p>Native iOS and Material Design action modal.</p>
      </BottomSheet>
    </App>
  )
}
`
}
