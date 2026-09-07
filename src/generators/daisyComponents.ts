import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getDaisyAppHeaderTemplate } from './templates/daisy/components/appHeader.js'
import { getDaisyTabBarTemplate } from './templates/daisy/components/tabBar.js'
import { getDaisyAppSidebarTemplate } from './templates/daisy/components/appSidebar.js'
import { getDaisyToastTemplate } from './templates/daisy/components/toast.js'
import { getDaisyAlertDialogTemplate } from './templates/daisy/components/alertDialog.js'
import { getDaisyBottomSheetTemplate } from './templates/daisy/components/bottomSheet.js'
import { getDaisyLoadingSpinnerTemplate } from './templates/daisy/components/loadingSpinner.js'
import { getDaisySkeletonTemplate } from './templates/daisy/components/skeleton.js'
import { getDaisySegmentedControlTemplate } from './templates/daisy/components/segmentedControl.js'
import { getDaisyPullToRefreshTemplate } from './templates/daisy/components/pullToRefresh.js'
import { getDaisyToggleSwitchTemplate } from './templates/daisy/components/toggleSwitch.js'
import { getDaisyBadgeTemplate } from './templates/daisy/components/badge.js'
import { getDaisyHomeViewTemplate } from './templates/daisy/views/homeView.js'
import { getDaisyControlsViewTemplate } from './templates/daisy/views/controlsView.js'
import { getDaisyOverlaysViewTemplate } from './templates/daisy/views/overlaysView.js'

export async function generateDaisyComponents(targetDir: string, options: ProjectOptions): Promise<void> {
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
  await writeComponent('appHeader', 'AppHeader', getDaisyAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getDaisyTabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getDaisyAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getDaisyToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getDaisyAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getDaisyBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getDaisyLoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getDaisySkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getDaisySegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getDaisyPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getDaisyToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getDaisyBadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getDaisyHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getDaisyControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getDaisyOverlaysViewTemplate(isTs))
}
