import { execa } from 'execa'
import type { PackageManager } from '../types/index.js'

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent
  if (!userAgent) return 'npm'

  if (userAgent.startsWith('pnpm')) return 'pnpm'
  if (userAgent.startsWith('bun')) return 'bun'
  if (userAgent.startsWith('yarn')) return 'yarn'
  return 'npm'
}

export async function installDependencies(targetDir: string, packageManager: PackageManager): Promise<void> {
  const args = packageManager === 'yarn' ? [] : ['install']
  await execa(packageManager, args, {
    cwd: targetDir,
    stdio: 'pipe',
  })
}
