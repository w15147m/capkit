import type { ProjectOptions } from '../../../types/index.js'

export function getIonicAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import {
  IonApp, IonContent, IonHeader, IonTitle, IonToolbar,
  IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon,
  IonRouterOutlet, IonBadge, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonChip,
  IonToast, IonAlert, setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Redirect } from 'react-router-dom'
import { homeOutline, gridOutline, alertCircleOutline } from 'ionicons/icons'
${options.android ? `import { Capacitor } from '@capacitor/core'` : ''}

/* Core Ionic CSS */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

setupIonicReact({ mode: 'ios' })

function HomePage() {
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [showToast, setShowToast] = useState${isTs ? '<boolean>' : ''}(false)
  const [showAlert, setShowAlert] = useState${isTs ? '<boolean>' : ''}(false)
  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>${options.projectName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome to CapKit</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Platform: <strong>{platform}</strong> {isNative ? '● Native' : '● Web'}</p>
            <p style={{ marginTop: 8 }}>Tap count: <strong>{count}</strong></p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <IonButton onClick={() => { setCount(c => c + 1); if ((count + 1) % 5 === 0) setShowToast(true) }}>
                Tap me!
              </IonButton>
              <IonButton fill="outline" color="danger" onClick={() => setShowAlert(true)}>
                Reset
              </IonButton>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <IonChip color="primary">Ionic React</IonChip>
              <IonChip color="secondary">Capacitor</IonChip>
              <IonChip color="tertiary">React 19</IonChip>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          message={\`Reached \${count} taps! 🎉\`}
          duration={2500}
          onDidDismiss={() => setShowToast(false)}
          position="top"
        />
        <IonAlert
          isOpen={showAlert}
          header="Reset counter?"
          message="This will reset your tap count back to 0."
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setShowAlert(false) },
            { text: 'Reset', role: 'destructive', handler: () => { setCount(0); setShowAlert(false) } },
          ]}
        />
      </IonContent>
    </>
  )
}

function ComponentsPage() {
  return (
    <>
      <IonHeader>
        <IonToolbar><IonTitle>Components</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <IonButton size="small">Default</IonButton>
              <IonButton size="small" fill="outline">Outline</IonButton>
              <IonButton size="small" color="success">Success</IonButton>
              <IonButton size="small" color="danger">Danger</IonButton>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <IonChip><IonLabel>iOS</IonLabel></IonChip>
              <IonChip color="secondary"><IonLabel>Android</IonLabel></IonChip>
              <IonChip color="tertiary"><IonLabel>Web</IonLabel></IonChip>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </>
  )
}

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" render={() => <HomePage />} />
            <Route exact path="/components" render={() => <ComponentsPage />} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="components" href="/components">
              <IonIcon icon={gridOutline} />
              <IonLabel>Components</IonLabel>
              <IonBadge>2</IonBadge>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
`
}
