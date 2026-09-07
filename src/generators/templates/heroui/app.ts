import type { ProjectOptions } from '../../../types/index.js'

export function getHeroUIAppTemplate(options: ProjectOptions, isTs: boolean): string {
  return `import { useState } from 'react'
import { HeroUIProvider, Button, Card, CardBody, CardHeader,
  Chip, Badge, Switch, Progress, Divider } from '@heroui/react'
${options.android ? `import { Capacitor } from '@capacitor/core'` : ''}

function HomeTab() {
  const [count, setCount] = useState${isTs ? '<number>' : ''}(0)
  ${options.android
    ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()`
    : `const platform = 'web'
  const isNative = false`}

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
        <CardBody className="gap-2">
          <p className="text-xs opacity-70 uppercase tracking-widest">Platform</p>
          <p className="text-3xl font-bold">{platform.toUpperCase()}</p>
          <Chip variant="flat" className="bg-white/20 text-white text-xs">{isNative ? '● Native' : '● Web'}</Chip>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-base font-semibold">Welcome to CapKit</h2>
        </CardHeader>
        <CardBody className="gap-3">
          <Progress
            label="Tap Progress"
            value={Math.min(count * 10, 100)}
            color="secondary"
            showValueLabel
          />
          <p className="text-sm text-default-500">Taps: <span className="font-bold text-foreground">{count}</span></p>
          <div className="flex gap-2">
            <Button color="primary" onPress={() => setCount(c => c + 1)}>Tap me!</Button>
            <Button variant="bordered" color="danger" onPress={() => setCount(0)}>Reset</Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Chip color="primary" variant="flat">HeroUI</Chip>
        <Chip color="secondary" variant="flat">Tailwind v4</Chip>
        <Chip color="success" variant="flat">Capacitor</Chip>
      </div>
    </div>
  )
}

function ComponentsTab() {
  const [toggled, setToggled] = useState${isTs ? '<boolean>' : ''}(true)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><h2 className="font-semibold">Buttons</h2></CardHeader>
        <CardBody className="gap-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="primary">Primary</Button>
            <Button size="sm" color="secondary">Secondary</Button>
            <Button size="sm" color="success">Success</Button>
            <Button size="sm" color="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="bordered">Bordered</Button>
            <Button size="sm" variant="flat">Flat</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode Toggle</span>
            <Switch isSelected={toggled} onValueChange={setToggled} color="secondary" />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState${isTs ? '<string>' : ''}('home')

  return (
    <HeroUIProvider>
      <div className="min-h-svh bg-default-100 flex flex-col dark">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-divider">
          <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
            <span className="text-lg font-bold">${options.projectName}</span>
            <Badge content="New" color="secondary" size="sm">
              <Chip size="sm" variant="flat" color="primary">CapKit</Chip>
            </Badge>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'components' && <ComponentsTab />}
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur border-t border-divider">
          <div className="max-w-md mx-auto flex">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'components', label: 'UI Kit', icon: '🧩' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition-colors \${
                  activeTab === tab.id ? 'text-primary font-semibold' : 'text-default-400'
                }\`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </HeroUIProvider>
  )
}

export default App
`
}
