export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type Language = 'ts' | 'js'

/** Styling / CSS engine chosen by the user */
export type StyleEngine =
  | 'tailwind'    // Tailwind CSS v4 via @tailwindcss/vite
  | 'scss'        // Sass / SCSS via sass-embedded
  | 'cssmodules'  // CSS Modules (Vite built-in, no extra pkg)
  | 'bootstrap'   // Bootstrap 5 + Popper.js
  | 'unocss'      // UnoCSS on-demand atomic engine
  | 'vanilla'     // Plain CSS with design tokens

/** UI component library chosen by the user */
export type UILibrary =
  | 'konsta'      // Tailwind-only: pixel-perfect iOS & Material
  | 'daisy'       // Tailwind-only: DaisyUI v5
  | 'shadcn'      // Tailwind-only: shadcn/ui (Radix primitives)
  | 'heroui'      // Tailwind-only: HeroUI (NextUI)
  | 'ionic'       // Any style: Ionic React
  | 'framework7'  // Any style: Framework7 React
  | 'mui'         // Any style: Material UI
  | 'none'        // No UI library

export interface ProjectOptions {
  projectName: string
  targetDir: string
  framework: 'react'
  language: Language
  style: StyleEngine
  uiLibrary: UILibrary
  android: boolean
  packageManager: PackageManager
  install: boolean
  // Convenience computed helpers (derived from style/uiLibrary)
  readonly tailwind: boolean   // style === 'tailwind'
  readonly konsta: boolean     // uiLibrary === 'konsta'
}

/** Factory to build a ProjectOptions with computed helpers */
export function makeProjectOptions(
  base: Omit<ProjectOptions, 'tailwind' | 'konsta'>,
): ProjectOptions {
  return {
    ...base,
    get tailwind() { return base.style === 'tailwind' },
    get konsta() { return base.uiLibrary === 'konsta' },
  }
}
