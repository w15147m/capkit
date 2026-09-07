import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getKonstaNavbarTemplate } from './templates/konsta/components/appNavbar.js'
import { getKonstaTabBarTemplate } from './templates/konsta/components/tabBar.js'
import { getKonstaSidebarTemplate } from './templates/konsta/components/appSidebar.js'
import { getKonstaToastTemplate } from './templates/konsta/components/toast.js'
import { getKonstaAlertDialogTemplate } from './templates/konsta/components/alertDialog.js'
import { getKonstaBottomSheetTemplate } from './templates/konsta/components/bottomSheet.js'
import { getKonstaLoadingSpinnerTemplate } from './templates/konsta/components/loadingSpinner.js'
import { getKonstaSegmentedTemplate } from './templates/konsta/components/segmentedControl.js'
import { getKonstaHomeViewTemplate } from './templates/konsta/views/homeView.js'
import { getKonstaControlsViewTemplate } from './templates/konsta/views/controlsView.js'
import { getKonstaOverlaysViewTemplate } from './templates/konsta/views/overlaysView.js'

export async function generateKonstaComponents(targetDir: string, options: ProjectOptions): Promise<void> {
  const isTs = options.language === 'ts'
  const ext = isTs ? 'tsx' : 'jsx'
  const indexExt = isTs ? 'ts' : 'js'

  // Helper to write component folder + index.ts
  async function writeComponent(folderName: string, componentName: string, code: string) {
    const componentDir = path.join(targetDir, 'src', 'components', folderName)
    await writeFile(path.join(componentDir, `${componentName}.${ext}`), code)
    await writeFile(
      path.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'\n`
    )
  }

  // Helper to write view folder + index.ts
  async function writeView(folderName: string, viewName: string, code: string) {
    const viewDir = path.join(targetDir, 'src', 'views', folderName)
    await writeFile(path.join(viewDir, `${viewName}.${ext}`), code)
    await writeFile(
      path.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'\n`
    )
  }

  // 1. Generate Modular Konsta Components under src/components/
  await writeComponent('appNavbar', 'AppNavbar', getKonstaNavbarTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getKonstaTabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getKonstaSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getKonstaToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getKonstaAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getKonstaBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getKonstaLoadingSpinnerTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getKonstaSegmentedTemplate(isTs))

  // 2. Generate Modular Konsta Tab Views under src/views/
  await writeView('homeView', 'HomeView', getKonstaHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getKonstaControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getKonstaOverlaysViewTemplate(isTs))
}
