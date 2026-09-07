import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { Language, StyleEngine, UILibrary } from '../types/index.js'
import { makeProjectOptions } from '../types/index.js'
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

      style: () =>
        p.select({
          message: 'Select a styling solution:',
          options: [
            { value: 'tailwind',   label: 'Tailwind CSS v4',  hint: 'Utility-first, recommended' },
            { value: 'scss',       label: 'SCSS / Sass',       hint: 'Nested CSS with variables' },
            { value: 'cssmodules', label: 'CSS Modules',       hint: 'Scoped per-component styling' },
            { value: 'bootstrap',  label: 'Bootstrap 5',       hint: 'Classic responsive grid' },
            { value: 'unocss',     label: 'UnoCSS',            hint: 'On-demand atomic CSS engine' },
            { value: 'vanilla',    label: 'Vanilla CSS',       hint: 'Pure CSS design tokens' },
          ],
          initialValue: 'tailwind',
        }),

      uiLibrary: ({ results }) => {
        const style = results.style as StyleEngine
        const isTailwind = style === 'tailwind'

        // Options available for any style engine
        const universalOptions = [
          { value: 'ionic',      label: 'Ionic React',   hint: 'Full native-feel cross-platform UI' },
          { value: 'framework7', label: 'Framework7',    hint: 'iOS & Material native mobile UI engine' },
          { value: 'mui',        label: 'Material UI',   hint: 'Google Material Design 3 components' },
          { value: 'none',       label: 'None',          hint: 'No UI library' },
        ]

        // Tailwind-only options prepended when Tailwind is selected
        const tailwindOptions = [
          { value: 'konsta', label: 'Konsta UI',  hint: 'Pixel-perfect iOS & Android native look' },
          { value: 'daisy',  label: 'DaisyUI',    hint: '50+ themes, semantic Tailwind classes' },
          { value: 'shadcn', label: 'shadcn/ui',  hint: 'Radix primitives + copy-paste components' },
          { value: 'heroui', label: 'HeroUI',     hint: 'Polished animations and dark mode' },
        ]

        const options = isTailwind
          ? [...tailwindOptions, ...universalOptions]
          : universalOptions

        return p.select({
          message: 'Select a UI component library:',
          options,
          initialValue: isTailwind ? 'konsta' : 'none',
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

  return makeProjectOptions({
    projectName: finalProjectName,
    targetDir: finalTargetDir,
    framework: 'react',
    language: (results.language as Language) ?? 'ts',
    style: (results.style as StyleEngine) ?? 'tailwind',
    uiLibrary: (results.uiLibrary as UILibrary) ?? 'none',
    android: Boolean(results.android),
    packageManager: results.packageManager as ProjectOptions['packageManager'],
    install: Boolean(results.install),
  })
}

