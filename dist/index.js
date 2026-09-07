#!/usr/bin/env node

// src/index.ts
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";
import path6 from "pathe";

// src/prompts/index.ts
import * as p from "@clack/prompts";
import pc from "picocolors";
import path2 from "pathe";

// src/utils/filesystem.ts
import fs from "fs-extra";
import path from "pathe";
async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}
async function writeFile(filePath, content) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}
async function writeJson(filePath, data) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, data, { spaces: 2 });
}
function isDirectoryEmpty(dirPath) {
  if (!fs.existsSync(dirPath)) return true;
  const files = fs.readdirSync(dirPath);
  return files.length === 0 || files.length === 1 && files[0] === ".git";
}
function formatPackageName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/^[._]/, "").replace(/[^a-z0-9-~]+/g, "-");
}

// src/utils/pkgManager.ts
import { execa } from "execa";
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) return "npm";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("yarn")) return "yarn";
  return "npm";
}
async function installDependencies(targetDir, packageManager) {
  const args = packageManager === "yarn" ? [] : ["install"];
  await execa(packageManager, args, {
    cwd: targetDir,
    stdio: "ignore"
  });
}

// src/prompts/index.ts
async function runPrompts() {
  console.log();
  p.intro(pc.bgCyan(pc.black(" CapKit \u2014 Create Capacitor App ")));
  const results = await p.group(
    {
      projectName: () => p.text({
        message: "Project name:",
        placeholder: "my-capacitor-app",
        defaultValue: "my-capacitor-app",
        validate(value) {
          if (!value) return "Project name is required";
          if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(value))
            return "Invalid package name. Use lowercase, numbers, and hyphens";
        }
      }),
      overwrite: ({ results: results2 }) => {
        const targetDir2 = path2.resolve(process.cwd(), results2.projectName);
        if (!isDirectoryEmpty(targetDir2)) {
          return p.confirm({
            message: `Directory "${results2.projectName}" is not empty. Overwrite?`,
            initialValue: false
          });
        }
        return Promise.resolve(true);
      },
      framework: () => p.select({
        message: "Select a frontend framework:",
        options: [
          { value: "react", label: "React", hint: "Vite + React 19" }
        ],
        initialValue: "react"
      }),
      language: () => p.select({
        message: "Select language:",
        options: [
          { value: "ts", label: "TypeScript", hint: "Recommended" },
          { value: "js", label: "JavaScript" }
        ],
        initialValue: "ts"
      }),
      tailwind: () => p.confirm({
        message: "Include Tailwind CSS v4?",
        initialValue: true
      }),
      konsta: ({ results: results2 }) => {
        if (!results2.tailwind) {
          p.log.warn("Konsta UI requires Tailwind CSS \u2014 skipping.");
          return Promise.resolve(false);
        }
        return p.confirm({
          message: "Include Konsta UI mobile components (native iOS / Android look)?",
          initialValue: true
        });
      },
      android: () => p.confirm({
        message: "Add Capacitor Android platform?",
        initialValue: true
      }),
      packageManager: () => p.select({
        message: "Select package manager:",
        options: [
          { value: "npm", label: "npm" },
          { value: "pnpm", label: "pnpm" },
          { value: "bun", label: "bun" },
          { value: "yarn", label: "yarn" }
        ],
        initialValue: detectPackageManager()
      }),
      install: () => p.confirm({
        message: "Install dependencies now?",
        initialValue: true
      })
    },
    {
      onCancel() {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
    }
  );
  const projectName = String(results.projectName);
  const targetDir = path2.resolve(process.cwd(), projectName);
  return {
    projectName: formatPackageName(projectName),
    targetDir,
    framework: "react",
    language: results.language ?? "ts",
    tailwind: Boolean(results.tailwind),
    konsta: Boolean(results.konsta),
    android: Boolean(results.android),
    packageManager: results.packageManager,
    install: Boolean(results.install)
  };
}

// src/generators/project.ts
import path5 from "pathe";

// src/generators/packageJson.ts
function generatePackageJson(options) {
  const dependencies = {
    react: "^19.2.8",
    "react-dom": "^19.2.8"
  };
  const devDependencies = {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    vite: "^8.2.2"
  };
  if (options.language === "ts") {
    devDependencies["typescript"] = "^5.7.2";
  }
  const scripts = {
    dev: "vite",
    build: "vite build",
    preview: "vite preview"
  };
  if (options.tailwind) {
    dependencies["tailwindcss"] = "^4.3.3";
    dependencies["@tailwindcss/vite"] = "^4.3.3";
  }
  if (options.konsta) {
    dependencies["konsta"] = "^5.4.0";
  }
  if (options.android) {
    dependencies["@capacitor/core"] = "^8.5.1";
    dependencies["@capacitor/android"] = "^8.5.1";
    devDependencies["@capacitor/cli"] = "^8.5.1";
  }
  return {
    name: options.projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts,
    dependencies,
    devDependencies
  };
}

// src/generators/capacitor.ts
import path3 from "pathe";
async function generateCapacitorConfig(targetDir, options) {
  const config = {
    appId: `com.example.${options.projectName.replace(/[^a-zA-Z0-9]/g, "")}`,
    appName: options.projectName,
    webDir: "dist",
    server: {
      url: "http://localhost:5173",
      cleartext: true
    }
  };
  await writeJson(path3.join(targetDir, "capacitor.config.json"), config);
}
async function generateAndroidGradleConfig(targetDir) {
  const gradlePropertiesContent = `# Project-wide Gradle settings
org.gradle.jvmargs=-Xmx1536m
android.useAndroidX=true

# Project-specific JDK: Use Java 21 for Capacitor Android build
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
`;
  await writeFile(path3.join(targetDir, "android", "gradle.properties"), gradlePropertiesContent);
}

// src/generators/files.ts
import path4 from "pathe";
async function generateProjectFiles(targetDir, options) {
  const isTs = options.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const configExt = isTs ? "ts" : "js";
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
`;
  await writeFile(path4.join(targetDir, "index.html"), indexHtml);
  let viteConfig = "";
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
`;
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
`;
  }
  await writeFile(path4.join(targetDir, `vite.config.${configExt}`), viteConfig);
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTs ? "!" : ""}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;
  await writeFile(path4.join(targetDir, "src", `main.${ext}`), mainContent);
  let indexCss = "";
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
`;
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
`;
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
`;
  }
  await writeFile(path4.join(targetDir, "src", "index.css"), indexCss);
  let appContent = "";
  if (options.konsta) {
    appContent = `import { useState, useEffect } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}
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
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  const [darkMode, setDarkMode] = useState${isTs ? "<boolean>" : ""}(true)
  const [hapticsEnabled, setHapticsEnabled] = useState${isTs ? "<boolean>" : ""}(true)

  ${options.android ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()
  const theme = platform === 'ios' ? 'ios' : 'material'` : `const platform = 'web'
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
                  {darkMode ? '\u{1F319}' : '\u2600\uFE0F'}
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
              Konsta UI \u2022 Tailwind CSS v4 \u2022 Capacitor {isNative ? 'Native' : 'Web'}
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
                  onChange={(e${isTs ? ": React.ChangeEvent<HTMLInputElement>" : ""}) => setDarkMode(e.target.checked)}
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
                  onChange={(e${isTs ? ": React.ChangeEvent<HTMLInputElement>" : ""}) => setHapticsEnabled(e.target.checked)}
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
`;
  } else {
    appContent = `import { useState } from 'react'
${options.android ? "import { Capacitor } from '@capacitor/core'" : ""}

function App() {
  const [count, setCount] = useState${isTs ? "<number>" : ""}(0)
  ${options.android ? `const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()` : `const platform = 'web'
  const isNative = false`}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2">${options.projectName}</h1>
      <p className="text-sm text-slate-400 mb-6">
        Platform: {platform.toUpperCase()} {isNative ? '\u2022 NATIVE' : '\u2022 WEB'}
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-white shadow-lg active:scale-95 transition-all"
      >
        Count: {count}
      </button>
    </div>
  )
}

export default App
`;
  }
  await writeFile(path4.join(targetDir, "src", `App.${ext}`), appContent);
  if (isTs) {
    const tsconfig = {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" }
      ]
    };
    await writeJson(path4.join(targetDir, "tsconfig.json"), tsconfig);
    const tsconfigApp = {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true
      },
      include: ["src"]
    };
    await writeJson(path4.join(targetDir, "tsconfig.app.json"), tsconfigApp);
    const tsconfigNode = {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        target: "ES2022",
        lib: ["ES2023"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true
      },
      include: ["vite.config.ts"]
    };
    await writeJson(path4.join(targetDir, "tsconfig.node.json"), tsconfigNode);
  }
  const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;
  await writeFile(path4.join(targetDir, ".gitignore"), gitignore);
  const readmeContent = `# ${options.projectName}

Scaffolded with **[CapKit](https://github.com/w15147m/capkit)** \u2014 Interactive Capacitor starter kit.

## \u{1F680} Tech Stack

- **Framework**: React 19 (${options.language.toUpperCase()})
- **Build Tool**: Vite
${options.tailwind ? "- **Styling**: Tailwind CSS v4\n" : ""}${options.konsta ? "- **Mobile UI Components**: Konsta UI (iOS & Material design)\n" : ""}${options.android ? "- **Native Runtime**: Capacitor 8 (Android)\n" : ""}

---

## \u{1F6E0}\uFE0F Getting Started (Development Server)

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

${options.android ? `## \u{1F4F1} Running on Android with Live Reload

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

## \u2699\uFE0F Capacitor & Android Configuration

- **Live Reload**: \`capacitor.config.json\` is configured to load \`http://localhost:5173\` during development. Any code changes will instantly update on your phone screen.
- **Java 21 Requirement**: Capacitor 8 Android builds require Java 21 JDK. \`android/gradle.properties\` is configured with \`org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64\`.

---

## \u{1F4E6} Production Build

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
` : ""}
`;
  await writeFile(path4.join(targetDir, "README.md"), readmeContent);
}

// src/generators/project.ts
async function generateProject(options) {
  const targetDir = options.targetDir;
  await ensureDir(targetDir);
  const packageJson = generatePackageJson(options);
  await writeJson(path5.join(targetDir, "package.json"), packageJson);
  await generateProjectFiles(targetDir, options);
  if (options.android) {
    await generateCapacitorConfig(targetDir, options);
    await generateAndroidGradleConfig(targetDir);
  }
  if (options.install) {
    await installDependencies(targetDir, options.packageManager);
  }
}

// src/index.ts
async function main() {
  const options = await runPrompts();
  const spinner2 = p2.spinner();
  spinner2.start("Scaffolding project files\u2026");
  try {
    await generateProject(options);
    spinner2.stop("Project files created!");
  } catch (err) {
    spinner2.stop(pc2.red("Failed to scaffold project!"));
    console.error(err);
    process.exit(1);
  }
  if (options.install) {
    const installSpinner = p2.spinner();
    installSpinner.start(`Installing dependencies with ${options.packageManager}\u2026`);
    installSpinner.stop("Dependencies installed!");
  }
  const relativeDir = path6.relative(process.cwd(), options.targetDir);
  p2.note(
    [
      pc2.cyan(`cd ${relativeDir}`),
      options.install ? "" : pc2.cyan(`${options.packageManager} install`),
      pc2.cyan("npm run dev -- --host"),
      "",
      options.android ? [
        pc2.dim("# Then on a new terminal:"),
        pc2.cyan("adb reverse tcp:5173 tcp:5173"),
        pc2.cyan("npx cap run android")
      ].join("\n") : ""
    ].filter(Boolean).join("\n"),
    "Next steps"
  );
  p2.outro(pc2.green("\u2714 Your Capacitor app is ready!"));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
