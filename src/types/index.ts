export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type Language = 'ts' | 'js'

export interface ProjectOptions {
  projectName: string
  targetDir: string
  framework: 'react'
  language: Language
  tailwind: boolean
  konsta: boolean
  android: boolean
  packageManager: PackageManager
  install: boolean
}
