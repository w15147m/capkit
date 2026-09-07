import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getScssVariablesTemplate } from './templates/scss/_variables.js'
import { getScssMainTemplate } from './templates/scss/main.js'

/**
 * Generate extra styling scaffolding files based on the chosen style engine.
 * Called from files.ts alongside the main index.css generation.
 */
export async function generateStylingFiles(
  targetDir: string,
  options: ProjectOptions,
): Promise<void> {
  switch (options.style) {
    case 'scss': {
      // Write _variables.scss and main.scss
      await writeFile(
        path.join(targetDir, 'src', 'styles', '_variables.scss'),
        getScssVariablesTemplate(),
      )
      await writeFile(
        path.join(targetDir, 'src', 'styles', 'main.scss'),
        getScssMainTemplate(),
      )
      break
    }

    case 'unocss': {
      // Write uno.config.ts
      const unoConfig = `import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2 }),
  ],
  theme: {
    colors: {
      primary: '#7c3aed',
      secondary: '#06b6d4',
    },
  },
})
`
      const ext = options.language === 'ts' ? 'ts' : 'js'
      await writeFile(path.join(targetDir, `uno.config.${ext}`), unoConfig)
      break
    }

    // bootstrap, cssmodules, vanilla, tailwind — no extra files needed
    default:
      break
  }
}
