import path from 'pathe'
import { execa } from 'execa'
import type { ProjectOptions } from '../types/index.js'
import { ensureDir, writeJson } from '../utils/filesystem.js'
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

  // 3. Generate Project Files (App.jsx, index.css, vite.config.js, index.html)
  await generateProjectFiles(targetDir, options)

  // 4. Generate Capacitor & Android Config if selected
  if (options.android) {
    await generateCapacitorConfig(targetDir, options)
    await generateAndroidGradleConfig(targetDir)
  }

  // 5. Initialize Git repository
  try {
    await execa('git', ['init'], { cwd: targetDir, stdio: 'ignore' })
  } catch {
    // Git init is optional
  }

  // 6. Install dependencies if requested
  if (options.install) {
    await installDependencies(targetDir, options.packageManager)
  }
}
