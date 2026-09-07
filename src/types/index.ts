export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export interface ProjectOptions {
  projectName: string
  targetDir: string
  framework: 'react'
  tailwind: boolean
  konsta: boolean
  android: boolean
  packageManager: PackageManager
  install: boolean
}
