import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getIonicAppHeaderTemplate } from './templates/ionic/components/appHeader.js'
import { getIonicTabBarTemplate } from './templates/ionic/components/tabBar.js'
import { getIonicAppSidebarTemplate } from './templates/ionic/components/appSidebar.js'
import { getIonicToastTemplate } from './templates/ionic/components/toast.js'
import { getIonicAlertDialogTemplate } from './templates/ionic/components/alertDialog.js'
import { getIonicBottomSheetTemplate } from './templates/ionic/components/bottomSheet.js'
import { getIonicLoadingSpinnerTemplate } from './templates/ionic/components/loadingSpinner.js'
import { getIonicSkeletonTemplate } from './templates/ionic/components/skeleton.js'
import { getIonicSegmentedControlTemplate } from './templates/ionic/components/segmentedControl.js'
import { getIonicPullToRefreshTemplate } from './templates/ionic/components/pullToRefresh.js'
import { getIonicToggleSwitchTemplate } from './templates/ionic/components/toggleSwitch.js'
import { getIonicBadgeTemplate } from './templates/ionic/components/badge.js'
import { getIonicHomeViewTemplate } from './templates/ionic/views/homeView.js'
import { getIonicControlsViewTemplate } from './templates/ionic/views/controlsView.js'
import { getIonicOverlaysViewTemplate } from './templates/ionic/views/overlaysView.js'

export async function generateIonicComponents(targetDir: string, options: ProjectOptions): Promise<void> {
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
  await writeComponent('appHeader', 'AppHeader', getIonicAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getIonicTabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getIonicAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getIonicToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getIonicAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getIonicBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getIonicLoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getIonicSkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getIonicSegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getIonicPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getIonicToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getIonicBadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getIonicHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getIonicControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getIonicOverlaysViewTemplate(isTs))
}
