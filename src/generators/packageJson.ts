import type { ProjectOptions } from '../types/index.js'

export function generatePackageJson(options: ProjectOptions): Record<string, unknown> {
  const dependencies: Record<string, string> = {
    react: '^19.2.8',
    'react-dom': '^19.2.8',
  }

  const devDependencies: Record<string, string> = {
    '@types/react': '^19.2.18',
    '@types/react-dom': '^19.2.4',
    '@vitejs/plugin-react': '^6.1.0',
    vite: '^8.2.2',
  }

  if (options.language === 'ts') {
    devDependencies['typescript'] = '^5.7.2'
  }

  const scripts: Record<string, string> = {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  }

  if (options.tailwind) {
    dependencies['tailwindcss'] = '^4.3.3'
    dependencies['@tailwindcss/vite'] = '^4.3.3'
  }

  if (options.konsta) {
    dependencies['konsta'] = '^5.4.0'
  }

  if (options.android) {
    dependencies['@capacitor/core'] = '^8.5.1'
    dependencies['@capacitor/android'] = '^8.5.1'
    devDependencies['@capacitor/cli'] = '^8.5.1'
  }

  return {
    name: options.projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
  }
}
