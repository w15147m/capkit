import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
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
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [hapticsEnabled, setHapticsEnabled] = useState(true)

  const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()
  const theme = platform === 'ios' ? 'ios' : 'material'

  return (
    <KonstaApp theme={theme} dark={darkMode} safeAreas>
      <Page className="bg-slate-950">
        <Navbar
          title="Capacitor + Konsta"
          subtitle="Mobile Starter Kit"
          className="top-0 sticky"
          right={
            <Badge colors={{ bg: isNative ? 'bg-emerald-500' : 'bg-blue-500' }}>
              {platform.toUpperCase()}
            </Badge>
          }
        />

        <Block className="text-center pt-4">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl mb-3 shadow-lg">
            <svg
              className="w-12 h-12 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            React Mobile App
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Konsta UI &bull; Tailwind CSS v4 &bull; Capacitor {isNative ? 'Native' : 'Web'}
          </p>
        </Block>

        <BlockTitle>Interactive State & HMR</BlockTitle>
        <Card className="bg-slate-900 border border-slate-800" margin="m-4">
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="font-semibold text-slate-100 text-sm">State Counter</p>
              <p className="text-xs text-slate-400">Taps: {count}</p>
            </div>
            <Button
              rounded
              className="w-auto px-4"
              onClick={() => setCount((c) => c + 1)}
            >
              Increment ({count})
            </Button>
          </div>
        </Card>

        <BlockTitle>Device & App Settings</BlockTitle>
        <List strong inset className="bg-slate-900 border border-slate-800">
          <ListItem
            title="Platform"
            after={platform.toUpperCase()}
            text={isNative ? 'Running on physical device' : 'Running in browser'}
          />
          <ListItem
            title="Dark Mode"
            after={
              <Toggle
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
          />
          <ListItem
            title="Haptics Feedback"
            after={
              <Toggle
                checked={hapticsEnabled}
                onChange={() => setHapticsEnabled(!hapticsEnabled)}
              />
            }
          />
        </List>

        <BlockTitle>Next Steps</BlockTitle>
        <List strong inset className="bg-slate-900 border border-slate-800">
          <ListItem
            link
            title="Hot Module Reload"
            text="Edit src/App.jsx to test live updates on your phone"
          />
          <ListItem
            link
            title="CLI Starter Kit"
            text="Ready to scaffold this full stack into our create-capacitor-app CLI"
          />
        </List>
      </Page>
    </KonstaApp>
  )
}

export default App


