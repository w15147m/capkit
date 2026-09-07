import * as p from '@clack/prompts'
import pc from 'picocolors'
import path from 'pathe'
import { runPrompts } from './prompts/index.js'
import { generateProject } from './generators/project.js'

async function main() {
  const targetDirArg = process.argv.slice(2)[0]
  const options = await runPrompts(targetDirArg)

  const spinner = p.spinner()

  spinner.start('Scaffolding project files…')
  try {
    await generateProject(options)
    spinner.stop('Project files created!')
  } catch (err) {
    spinner.stop(pc.red('Failed to scaffold project!'))
    console.error(err)
    process.exit(1)
  }

  if (options.install) {
    const installSpinner = p.spinner()
    installSpinner.start(`Installing dependencies with ${options.packageManager}…`)
    // installation is handled inside generateProject when install: true
    installSpinner.stop('Dependencies installed!')
  }

  const isCurrentDir = options.targetDir === process.cwd()
  const relativeDir = isCurrentDir ? '' : path.relative(process.cwd(), options.targetDir)

  p.note(
    [
      relativeDir ? pc.cyan(`cd ${relativeDir}`) : '',
      options.install ? '' : pc.cyan(`${options.packageManager} install`),
      !options.install && options.android ? pc.cyan('npx cap add android') : '',
      pc.cyan('npm run dev -- --host'),
      '',
      options.android
        ? [
            pc.dim('# On a separate terminal:'),
            pc.cyan('adb reverse tcp:5173 tcp:5173'),
            pc.cyan('npx cap run android'),
          ].join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n'),
    'Next steps'
  )

  p.outro(pc.green('✔ Your Capacitor app is ready!'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
