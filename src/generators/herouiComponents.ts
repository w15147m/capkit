import path from 'pathe'
import type { ProjectOptions } from '../types/index.js'
import { writeFile } from '../utils/filesystem.js'
import { getHeroUIAppHeaderTemplate } from './templates/heroui/components/appHeader.js'
import { getHeroUITabBarTemplate } from './templates/heroui/components/tabBar.js'
import { getHeroUIAppSidebarTemplate } from './templates/heroui/components/appSidebar.js'
import { getHeroUIToastTemplate } from './templates/heroui/components/toast.js'
import { getHeroUIAlertDialogTemplate } from './templates/heroui/components/alertDialog.js'
import { getHeroUIBottomSheetTemplate } from './templates/heroui/components/bottomSheet.js'
import { getHeroUILoadingSpinnerTemplate } from './templates/heroui/components/loadingSpinner.js'
import { getHeroUISkeletonTemplate } from './templates/heroui/components/skeleton.js'
import { getHeroUISegmentedControlTemplate } from './templates/heroui/components/segmentedControl.js'
import { getHeroUIPullToRefreshTemplate } from './templates/heroui/components/pullToRefresh.js'
import { getHeroUIToggleSwitchTemplate } from './templates/heroui/components/toggleSwitch.js'
import { getHeroUIBadgeTemplate } from './templates/heroui/components/badge.js'
import { getHeroUIHomeViewTemplate } from './templates/heroui/views/homeView.js'
import { getHeroUIControlsViewTemplate } from './templates/heroui/views/controlsView.js'
import { getHeroUIOverlaysViewTemplate } from './templates/heroui/views/overlaysView.js'

export async function generateHeroUIComponents(targetDir: string, options: ProjectOptions): Promise<void> {
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
  await writeComponent('appHeader', 'AppHeader', getHeroUIAppHeaderTemplate(isTs))
  await writeComponent('tabBar', 'TabBar', getHeroUITabBarTemplate(isTs))
  await writeComponent('appSidebar', 'AppSidebar', getHeroUIAppSidebarTemplate(isTs))
  await writeComponent('toast', 'Toast', getHeroUIToastTemplate(isTs))
  await writeComponent('alertDialog', 'AlertDialog', getHeroUIAlertDialogTemplate(isTs))
  await writeComponent('bottomSheet', 'BottomSheet', getHeroUIBottomSheetTemplate(isTs))
  await writeComponent('loadingSpinner', 'LoadingSpinner', getHeroUILoadingSpinnerTemplate(isTs))
  await writeComponent('skeleton', 'Skeleton', getHeroUISkeletonTemplate(isTs))
  await writeComponent('segmentedControl', 'SegmentedControl', getHeroUISegmentedControlTemplate(isTs))
  await writeComponent('pullToRefresh', 'PullToRefresh', getHeroUIPullToRefreshTemplate(isTs))
  await writeComponent('toggleSwitch', 'ToggleSwitch', getHeroUIToggleSwitchTemplate(isTs))
  await writeComponent('badge', 'Badge', getHeroUIBadgeTemplate(isTs))

  // Views
  await writeView('homeView', 'HomeView', getHeroUIHomeViewTemplate(isTs))
  await writeView('controlsView', 'ControlsView', getHeroUIControlsViewTemplate(isTs))
  await writeView('overlaysView', 'OverlaysView', getHeroUIOverlaysViewTemplate(isTs))
}
