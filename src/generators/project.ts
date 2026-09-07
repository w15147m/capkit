import path from 'pathe'
import { execa } from 'execa'
import type { ProjectOptions } from '../types/index.js'
import { ensureDir, writeFile, writeJson } from '../utils/filesystem.js'
import { generatePackageJson } from './packageJson.js'
import { generateCapacitorConfig, generateAndroidGradleConfig } from './capacitor.js'
import { generateProjectFiles } from './files.js'
import { installDependencies } from '../utils/pkgManager.js'

export async function generateProject(options: ProjectOptions): Promise<void> {
  const targetDir = options.targetDir

  // 1. Ensure target directory exists
  await ensureDir(targetDir)

  // 2. Generate package.json
  const packageJson = generatePackageJson(options)
  await writeJson(path.join(targetDir, 'package.json'), packageJson)

  // 3. Generate Project Files (App.jsx, index.css, vite.config.js, index.html, README.md)
  await generateProjectFiles(targetDir, options)

  // 4. Generate Capacitor Config & placeholder dist/ if selected
  if (options.android) {
    await ensureDir(path.join(targetDir, 'dist'))
    await writeFile(
      path.join(targetDir, 'dist', 'index.html'),
      '<!doctype html><html><body></body></html>'
    )
    await generateCapacitorConfig(targetDir, options)
  }

  // 5. Install dependencies and initialize Android platform if requested
  if (options.install) {
    await installDependencies(targetDir, options.packageManager)

    if (options.android) {
      try {
        await execa('npx', ['cap', 'add', 'android'], { cwd: targetDir, stdio: 'ignore' })
        await generateAndroidGradleConfig(targetDir)
      } catch (err) {
        // cap add android fallback
      }
    }
  }
}
