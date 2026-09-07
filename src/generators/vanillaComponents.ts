import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getVanillaAppHeaderTemplate } from './templates/vanilla/components/appHeader.js'
import { getVanillaTabBarTemplate } from './templates/vanilla/components/tabBar.js'
import { getVanillaAppSidebarTemplate } from './templates/vanilla/components/appSidebar.js'
import { getVanillaToastTemplate } from './templates/vanilla/components/toast.js'
import { getVanillaAlertDialogTemplate } from './templates/vanilla/components/alertDialog.js'
import { getVanillaBottomSheetTemplate } from './templates/vanilla/components/bottomSheet.js'
import { getVanillaLoadingSpinnerTemplate } from './templates/vanilla/components/loadingSpinner.js'
import { getVanillaSkeletonTemplate } from './templates/vanilla/components/skeleton.js'
import { getVanillaSegmentedControlTemplate } from './templates/vanilla/components/segmentedControl.js'
import { getVanillaPullToRefreshTemplate } from './templates/vanilla/components/pullToRefresh.js'
import { getVanillaToggleSwitchTemplate } from './templates/vanilla/components/toggleSwitch.js'
import { getVanillaBadgeTemplate } from './templates/vanilla/components/badge.js'
import { getVanillaHomeViewTemplate } from './templates/vanilla/views/homeView.js'
import { getVanillaControlsViewTemplate } from './templates/vanilla/views/controlsView.js'
import { getVanillaOverlaysViewTemplate } from './templates/vanilla/views/overlaysView.js'

export async function generateVanillaComponents(targetDir: string, options: ProjectOptions): Promise<void> {
  const isTs = options.language === 'ts'
  const ext = isTs ? 'tsx' : 'jsx'
  const indexExt = isTs ? 'ts' : 'js'

  async function writeComponent(folderName: string, componentName: string, code: string) {
    const componentDir = path.join(targetDir, 'src', 'components', folderName)
    await writeFile(path.join(componentDir, `${componentName}.${ext}`), code)
    await writeFile(
      path.join(componentDir, `index.${indexExt}`),
      `export { default } from './${componentName}'\n`
    )
  }

  async function writeView(folderName: string, viewName: string, code: string) {
    const viewDir = path.join(targetDir, 'src', 'views', folderName)
    await writeFile(path.join(viewDir, `${viewName}.${ext}`), code)
    await writeFile(
      path.join(viewDir, `index.${indexExt}`),
      `export { default } from './${viewName}'\n`
    )
  }

  // Components
  await writeComponent('appHeader', 'AppHeader', getVanillaAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getVanillaTabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getVanillaAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getVanillaToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getVanillaAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getVanillaBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getVanillaLoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getVanillaSkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getVanillaSegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getVanillaPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getVanillaToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getVanillaBadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getVanillaHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getVanillaControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getVanillaOverlaysViewTemplate(isTs))
}
