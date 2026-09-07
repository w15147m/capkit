import type { ProjectOptions } from '../../../types/index.js'

export function getFramework7AppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import Framework7 from 'framework7/lite-bundle'
import Framework7React, { App as F7App, View, Page, Navbar,
  Block, Button, Card, CardContent, CardHeader, CardFooter,
  Chip, Toolbar, Link, Progressbar, Toggle, Dialog
} from 'framework7-react'
import 'framework7/css/bundle'
${options.android ? `import { Capacitor } from '@capacitor/core'` : ''}

Framework7.use(Framework7React)

const f7params = {
  name: '${options.projectName}',
  theme: 'ios',
}

function HomePage() {
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  const [dialogOpen, setDialogOpen] = useState${isTs ? '<boolean>' : ''}(false)
  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  return (
    <Page name="home">
      <Navbar title="${options.projectName}" />

      <Block strong inset className="space-y-3">
        <p style={{ fontSize: 14, color: '#888' }}>
          Platform: <strong>{platform.toUpperCase()}</strong> {isNative ? '● Native' : '● Web'}
        </p>
        <Progressbar progress={Math.min(count * 10, 100)} color="blue" />
        <p>Taps: <strong>{count}</strong></p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button fill onClick={() => setCount(c => c + 1)}>Tap me!</Button>
          <Button outline color="red" onClick={() => setDialogOpen(true)}>Reset</Button>
        </div>
      </Block>

      <Card>
        <CardHeader>Welcome to CapKit</CardHeader>
        <CardContent>
          <p style={{ fontSize: 13 }}>
            Built with Framework7 React. A mobile-first Capacitor starter with native iOS & Material Design components.
          </p>
        </CardContent>
        <CardFooter>
          <Chip text="Framework7" mediaBgColor="blue" />
          <Chip text="Capacitor" mediaBgColor="green" />
        </CardFooter>
      </Card>

      <Dialog
        opened={dialogOpen}
        title="Reset counter?"
        content="This will reset your tap count back to 0."
        buttons={[
          { text: 'Cancel', onClick: () => setDialogOpen(false) },
          { text: 'Reset', bold: true, color: 'red', onClick: () => { setCount(0); setDialogOpen(false) } },
        ]}
        onBackdropClick={() => setDialogOpen(false)}
      />
    </Page>
  )
}

function ComponentsPage() {
  const [toggled, setToggled] = useState${isTs ? '<boolean>' : ''}(true)

  return (
    <Page name="components">
      <Navbar title="Components" />
      <Block strong inset>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button fill small>Primary</Button>
          <Button outline small>Outline</Button>
          <Button fill small color="green">Success</Button>
          <Button fill small color="red">Danger</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <span style={{ fontSize: 14 }}>Toggle</span>
          <Toggle checked={toggled} onChange={() => setToggled(!toggled)} color="blue" />
        </div>
      </Block>
    </Page>
  )
}

function App() {
  return (
    <F7App {...f7params}>
      <View
        main
        url="/home/"
        browserHistory
        routes={[
          { path: '/home/', component: HomePage },
          { path: '/components/', component: ComponentsPage },
        ]}
      >
        <Toolbar tabbar bottom>
          <Link tabLink="#home" tabLinkActive iconF7="house_fill" text="Home" />
          <Link tabLink="#components" iconF7="square_grid_2x2" text="UI Kit" />
        </Toolbar>
      </View>
    </F7App>
  )
}

export default App
`
}
