import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile, writeJson } from '../utils/filesystem.js'
import { generateTailwindComponents } from './tailwindComponents.js'
import { getAppTemplate } from './templates/app.js'
import { generateKonstaComponents } from './konstaComponents.js'
import { getKonstaAppTemplate } from './templates/konsta/app.js'
import { generateDaisyComponents } from './daisyComponents.js'
import { getDaisyAppTemplate } from './templates/daisy/app.js'
import { generateIonicComponents } from './ionicComponents.js'
import { getIonicAppTemplate } from './templates/ionic/app.js'
import { generateHeroUIComponents } from './herouiComponents.js'
import { getHeroUIAppTemplate } from './templates/heroui/app.js'
import { generateMUIComponents } from './muiComponents.js'
import { getMUIAppTemplate } from './templates/mui/app.js'
import { generateFramework7Components } from './framework7Components.js'
import { getFramework7AppTemplate } from './templates/framework7/app.js'
import { generateVanillaComponents } from './vanillaComponents.js'
import { getVanillaAppTemplate } from './templates/vanilla/app.js'
import { generateStylingFiles } from './stylingGenerators.js'

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

  // 2. vite.config — branches per style engine
  let viteConfig = ''
  if (options.style === 'tailwind') {
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
  } else if (options.style === 'unocss') {
    viteConfig = `import UnoCSS from '@unocss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), UnoCSS()],
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
  let mainImports = `import './index.css'`
  if (options.style === 'scss') {
    mainImports = `import './styles/main.scss'`
  } else if (options.style === 'unocss') {
    mainImports = `import 'virtual:uno.css'\nimport './index.css'`
  }
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
${mainImports}
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTs ? '!' : ''}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
  await writeFile(path.join(targetDir, 'src', `main.${ext}`), mainContent)

  // 4. src/index.css — branches per style + uiLibrary
  let indexCss = ''
  if (options.style === 'tailwind' && options.uiLibrary === 'konsta') {
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
  } else if (options.style === 'tailwind' && options.uiLibrary === 'daisy') {
    indexCss = `@import "tailwindcss";
@plugin "daisyui";

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`
  } else if (options.style === 'tailwind') {
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
  } else if (options.style === 'bootstrap') {
    indexCss = `@import "bootstrap/dist/css/bootstrap.min.css";

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
`
  } else {
    // vanilla, cssmodules, scss (scss has its own main.scss), unocss
    indexCss = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
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
  }
  await writeFile(path.join(targetDir, 'src', 'index.css'), indexCss)

  // 4b. Generate extra styling files (SCSS partials, UnoCSS config, etc.)
  await generateStylingFiles(targetDir, options)

  // 5. src/App.tsx or App.jsx — route by uiLibrary, then fall back to style
  let appContent = ''
  switch (options.uiLibrary) {
    case 'konsta':
      await generateKonstaComponents(targetDir, options)
      appContent = getKonstaAppTemplate(options, isTs)
      break
    case 'daisy':
      await generateDaisyComponents(targetDir, options)
      appContent = getDaisyAppTemplate(options, isTs)
      break
    case 'ionic':
      await generateIonicComponents(targetDir, options)
      appContent = getIonicAppTemplate(options, isTs)
      break
    case 'heroui':
      await generateHeroUIComponents(targetDir, options)
      appContent = getHeroUIAppTemplate(options, isTs)
      break
    case 'mui':
      await generateMUIComponents(targetDir, options)
      appContent = getMUIAppTemplate(options, isTs)
      break
    case 'framework7':
      await generateFramework7Components(targetDir, options)
      appContent = getFramework7AppTemplate(options, isTs)
      break
    case 'shadcn':
      // shadcn uses tailwind components with Radix — fall through to tailwind
      await generateTailwindComponents(targetDir, options)
      appContent = getAppTemplate(options, isTs)
      break
    case 'none':
    default:
      if (options.style === 'tailwind') {
        await generateTailwindComponents(targetDir, options)
        appContent = getAppTemplate(options, isTs)
      } else {
        await generateVanillaComponents(targetDir, options)
        appContent = getVanillaAppTemplate(options, isTs)
      }
      break
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
- **Styling**: ${getStyleLabel(options.style)}
${options.uiLibrary !== 'none' ? `- **UI Library**: ${getUILibraryLabel(options.uiLibrary)}\n` : ''}${options.android ? '- **Native Runtime**: Capacitor 8 (Android)\n' : ''}

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

// ── Label helpers for README ──────────────────────────────────────────────────
function getStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    tailwind:   'Tailwind CSS v4',
    scss:       'SCSS / Sass',
    cssmodules: 'CSS Modules',
    bootstrap:  'Bootstrap 5',
    unocss:     'UnoCSS',
    vanilla:    'Vanilla CSS',
  }
  return labels[style] ?? style
}

function getUILibraryLabel(lib: string): string {
  const labels: Record<string, string> = {
    konsta:     'Konsta UI (iOS & Material)',
    daisy:      'DaisyUI',
    shadcn:     'shadcn/ui',
    heroui:     'HeroUI (NextUI)',
    ionic:      'Ionic React',
    framework7: 'Framework7',
    mui:        'Material UI',
  }
  return labels[lib] ?? lib
}
