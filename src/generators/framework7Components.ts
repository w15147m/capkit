import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getFramework7AppHeaderTemplate } from './templates/framework7/components/appHeader.js'
import { getFramework7TabBarTemplate } from './templates/framework7/components/tabBar.js'
import { getFramework7AppSidebarTemplate } from './templates/framework7/components/appSidebar.js'
import { getFramework7ToastTemplate } from './templates/framework7/components/toast.js'
import { getFramework7AlertDialogTemplate } from './templates/framework7/components/alertDialog.js'
import { getFramework7BottomSheetTemplate } from './templates/framework7/components/bottomSheet.js'
import { getFramework7LoadingSpinnerTemplate } from './templates/framework7/components/loadingSpinner.js'
import { getFramework7SkeletonTemplate } from './templates/framework7/components/skeleton.js'
import { getFramework7SegmentedControlTemplate } from './templates/framework7/components/segmentedControl.js'
import { getFramework7PullToRefreshTemplate } from './templates/framework7/components/pullToRefresh.js'
import { getFramework7ToggleSwitchTemplate } from './templates/framework7/components/toggleSwitch.js'
import { getFramework7BadgeTemplate } from './templates/framework7/components/badge.js'
import { getFramework7HomeViewTemplate } from './templates/framework7/views/homeView.js'
import { getFramework7ControlsViewTemplate } from './templates/framework7/views/controlsView.js'
import { getFramework7OverlaysViewTemplate } from './templates/framework7/views/overlaysView.js'

export async function generateFramework7Components(targetDir: string, options: ProjectOptions): Promise<void> {
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
  await writeComponent('appHeader', 'AppHeader', getFramework7AppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getFramework7TabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getFramework7AppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getFramework7ToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getFramework7AlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getFramework7BottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getFramework7LoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getFramework7SkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getFramework7SegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getFramework7PullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getFramework7ToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getFramework7BadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getFramework7HomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getFramework7ControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getFramework7OverlaysViewTemplate(isTs))
}
