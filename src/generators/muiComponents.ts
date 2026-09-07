import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getMUIAppHeaderTemplate } from './templates/mui/components/appHeader.js'
import { getMUITabBarTemplate } from './templates/mui/components/tabBar.js'
import { getMUIAppSidebarTemplate } from './templates/mui/components/appSidebar.js'
import { getMUIToastTemplate } from './templates/mui/components/toast.js'
import { getMUIAlertDialogTemplate } from './templates/mui/components/alertDialog.js'
import { getMUIBottomSheetTemplate } from './templates/mui/components/bottomSheet.js'
import { getMUILoadingSpinnerTemplate } from './templates/mui/components/loadingSpinner.js'
import { getMUISkeletonTemplate } from './templates/mui/components/skeleton.js'
import { getMUISegmentedControlTemplate } from './templates/mui/components/segmentedControl.js'
import { getMUIPullToRefreshTemplate } from './templates/mui/components/pullToRefresh.js'
import { getMUIToggleSwitchTemplate } from './templates/mui/components/toggleSwitch.js'
import { getMUIBadgeTemplate } from './templates/mui/components/badge.js'
import { getMUIHomeViewTemplate } from './templates/mui/views/homeView.js'
import { getMUIControlsViewTemplate } from './templates/mui/views/controlsView.js'
import { getMUIOverlaysViewTemplate } from './templates/mui/views/overlaysView.js'

export async function generateMUIComponents(targetDir: string, options: ProjectOptions): Promise<void> {
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
  await writeComponent('appHeader', 'AppHeader', getMUIAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getMUITabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getMUIAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getMUIToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getMUIAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getMUIBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getMUILoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getMUISkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getMUISegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getMUIPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getMUIToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getMUIBadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getMUIHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getMUIControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getMUIOverlaysViewTemplate(isTs))
}
