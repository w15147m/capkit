import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { Language } from '../types/index.js'
import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { formatPackageName, isDirectoryEmpty } from '../utils/filesystem.js'
import { detectPackageManager } from '../utils/pkgManager.js'

export async function runPrompts(targetDirArg?: string): Promise<ProjectOptions> {
  console.log()
  p.intro(pc.bgCyan(pc.black(' CapKit — Create Capacitor App ')))

  const isCurrentDir = targetDirArg === '.'
  let targetDir = isCurrentDir
    ? process.cwd()
    : targetDirArg
    ? path.resolve(process.cwd(), targetDirArg)
    : ''
  let initialProjectName = isCurrentDir
    ? formatPackageName(path.basename(process.cwd())) || 'my-capacitor-app'
    : targetDirArg
    ? formatPackageName(targetDirArg)
    : ''

  const results = await p.group(
    {
      projectName: () => {
        if (targetDirArg) {
          return Promise.resolve(initialProjectName)
        }
        return p.text({
          message: 'Project name:',
          placeholder: 'my-capacitor-app',
          defaultValue: 'my-capacitor-app',
          validate(value) {
            if (!value) return 'Project name is required'
            if (value.trim() === '.') return undefined
            if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(value))
              return 'Invalid package name. Use lowercase, numbers, and hyphens (or "." for current directory)'
          },
        })
      },

      overwrite: ({ results }) => {
        const rawName = String(results.projectName).trim()
        if (rawName === '.' || isCurrentDir) {
          targetDir = process.cwd()
          initialProjectName = formatPackageName(path.basename(process.cwd())) || 'my-capacitor-app'
        } else {
          targetDir = path.resolve(process.cwd(), rawName)
          initialProjectName = formatPackageName(rawName)
        }

        if (!isDirectoryEmpty(targetDir)) {
          return p.confirm({
            message:
              targetDir === process.cwd()
                ? 'Current directory is not empty. Continue and write files?'
                : `Directory "${rawName}" is not empty. Overwrite?`,
            initialValue: false,
          })
        }
        return Promise.resolve(true)
      },

      framework: () =>
        p.select({
          message: 'Select a frontend framework:',
          options: [
            { value: 'react', label: 'React', hint: 'Vite + React 19' },
          ],
          initialValue: 'react',
        }),

      language: () =>
        p.select({
          message: 'Select language:',
          options: [
            { value: 'ts', label: 'TypeScript', hint: 'Recommended' },
            { value: 'js', label: 'JavaScript' },
          ],
          initialValue: 'ts',
        }),

      tailwind: () =>
        p.confirm({
          message: 'Include Tailwind CSS v4?',
          initialValue: true,
        }),

      konsta: ({ results }) => {
        if (!results.tailwind) {
          p.log.warn('Konsta UI requires Tailwind CSS — skipping.')
          return Promise.resolve(false)
        }
        return p.confirm({
          message: 'Include Konsta UI mobile components (native iOS / Android look)?',
          initialValue: true,
        })
      },

      android: () =>
        p.confirm({
          message: 'Add Capacitor Android platform?',
          initialValue: true,
        }),

      packageManager: () =>
        p.select({
          message: 'Select package manager:',
          options: [
            { value: 'npm',  label: 'npm' },
            { value: 'pnpm', label: 'pnpm' },
            { value: 'bun',  label: 'bun' },
            { value: 'yarn', label: 'yarn' },
          ],
          initialValue: detectPackageManager(),
        }),

      install: () =>
        p.confirm({
          message: 'Install dependencies now?',
          initialValue: true,
        }),
    },
    {
      onCancel() {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    }
  )

  if (results.overwrite === false) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }

  const rawName = String(results.projectName).trim()
  const isDot = rawName === '.' || isCurrentDir
  const finalTargetDir = isDot ? process.cwd() : path.resolve(process.cwd(), rawName)
  const finalProjectName = isDot
    ? formatPackageName(path.basename(process.cwd())) || 'my-capacitor-app'
    : formatPackageName(rawName)

  return {
    projectName: finalProjectName,
    targetDir: finalTargetDir,
    framework: 'react',
    language: (results.language as Language) ?? 'ts',
    tailwind: Boolean(results.tailwind),
    konsta: Boolean(results.konsta),
    android: Boolean(results.android),
    packageManager: results.packageManager as ProjectOptions['packageManager'],
    install: Boolean(results.install),
  }
}
