import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getAppHeaderTemplate } from './templates/components/appHeader.js'
import { getTabBarTemplate } from './templates/components/tabBar.js'
import { getAppSidebarTemplate } from './templates/components/appSidebar.js'
import { getToastTemplate } from './templates/components/toast.js'
import { getAlertDialogTemplate } from './templates/components/alertDialog.js'
import { getBottomSheetTemplate } from './templates/components/bottomSheet.js'
import { getLoadingSpinnerTemplate } from './templates/components/loadingSpinner.js'
import { getSkeletonTemplate } from './templates/components/skeleton.js'
import { getSegmentedControlTemplate } from './templates/components/segmentedControl.js'
import { getPullToRefreshTemplate } from './templates/components/pullToRefresh.js'
import { getToggleSwitchTemplate } from './templates/components/toggleSwitch.js'
import { getBadgeTemplate } from './templates/components/badge.js'
import { getHomeViewTemplate } from './templates/views/homeView.js'
import { getControlsViewTemplate } from './templates/views/controlsView.js'
import { getOverlaysViewTemplate } from './templates/views/overlaysView.js'

export async function generateTailwindComponents(targetDir: string, options: ProjectOptions): Promise<void> {
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

  // 1. Generate Modular Components under src/components/
  await writeComponent('appHeader', 'AppHeader', getAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getTabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getLoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getSkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getSegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getBadgeTemplate(isTs))

  // 2. Generate Modular Tab Views under src/views/
  await writeView('homeView', 'HomeView', getHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getOverlaysViewTemplate(isTs))
}
