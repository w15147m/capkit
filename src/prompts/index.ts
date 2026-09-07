import * as p from '@clack/prompts'
import pc from 'picocolors'
import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { formatPackageName, isDirectoryEmpty } from '../utils/filesystem.js'
import { detectPackageManager } from '../utils/pkgManager.js'

export async function runPrompts(): Promise<ProjectOptions> {
  console.log()
  p.intro(pc.bgCyan(pc.black(' Create Capacitor App ')))

  const results = await p.group(
    {
      projectName: () =>
        p.text({
          message: 'Project name:',
          placeholder: 'my-capacitor-app',
          defaultValue: 'my-capacitor-app',
          validate(value) {
            if (!value) return 'Project name is required'
            if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(value))
              return 'Invalid package name. Use lowercase, numbers, and hyphens'
          },
        }),

      overwrite: ({ results }) => {
        const targetDir = path.resolve(process.cwd(), results.projectName as string)
        if (!isDirectoryEmpty(targetDir)) {
          return p.confirm({
            message: `Directory "${results.projectName}" is not empty. Overwrite?`,
            initialValue: false,
          })
        }
        return Promise.resolve(true)
      },

      framework: () =>
        p.select({
          message: 'Select a frontend framework:',
          options: [
            { value: 'react', label: 'React', hint: 'Vite + React 19 + JSX' },
          ],
          initialValue: 'react',
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

  const projectName = String(results.projectName)
  const targetDir = path.resolve(process.cwd(), projectName)

  return {
    projectName: formatPackageName(projectName),
    targetDir,
    framework: 'react',
    tailwind: Boolean(results.tailwind),
    konsta: Boolean(results.konsta),
    android: Boolean(results.android),
    packageManager: results.packageManager as ProjectOptions['packageManager'],
    install: Boolean(results.install),
  }
}
