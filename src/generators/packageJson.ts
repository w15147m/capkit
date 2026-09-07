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

  // ── Styling engine deps ──────────────────────────────────────────────────
  switch (options.style) {
    case 'tailwind':
      dependencies['tailwindcss'] = '^4.3.3'
      dependencies['@tailwindcss/vite'] = '^4.3.3'
      break
    case 'scss':
      devDependencies['sass-embedded'] = '^1.89.0'
      break
    case 'bootstrap':
      dependencies['bootstrap'] = '^5.3.3'
      dependencies['@popperjs/core'] = '^2.11.8'
      break
    case 'unocss':
      devDependencies['unocss'] = '^65.6.0'
      devDependencies['@unocss/vite'] = '^65.6.0'
      break
    case 'cssmodules':
    case 'vanilla':
      // No extra packages — Vite handles both natively
      break
  }

  // ── UI library deps ──────────────────────────────────────────────────────
  switch (options.uiLibrary) {
    case 'konsta':
      dependencies['konsta'] = '^5.4.0'
      break
    case 'daisy':
      devDependencies['daisyui'] = '^5.0.43'
      break
    case 'shadcn':
      dependencies['class-variance-authority'] = '^0.7.1'
      dependencies['clsx'] = '^2.1.1'
      dependencies['tailwind-merge'] = '^3.3.0'
      dependencies['lucide-react'] = '^0.513.0'
      break
    case 'heroui':
      dependencies['@heroui/react'] = '^2.7.8'
      dependencies['framer-motion'] = '^11.18.2'
      break
    case 'ionic':
      dependencies['@ionic/react'] = '^8.5.0'
      dependencies['@ionic/react-router'] = '^8.5.0'
      dependencies['ionicons'] = '^7.4.0'
      dependencies['react-router-dom'] = '^6.30.0'
      break
    case 'framework7':
      dependencies['framework7'] = '^9.2.0'
      dependencies['framework7-react'] = '^9.2.0'
      break
    case 'mui':
      dependencies['@mui/material'] = '^7.1.1'
      dependencies['@emotion/react'] = '^11.14.0'
      dependencies['@emotion/styled'] = '^11.14.0'
      break
    case 'none':
      break
  }

  // ── Capacitor deps ───────────────────────────────────────────────────────
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

