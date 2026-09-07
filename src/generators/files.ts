import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile, writeJson } from '../utils/filesystem.js'
import { generateTailwindComponents } from './tailwindComponents.js'
import { getAppTemplate } from './templates/app.js'

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
    appContent = getAppTemplate(options, isTs)
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
