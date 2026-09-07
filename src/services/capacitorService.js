import { Capacitor } from '@capacitor/core';
import { getPlatformInfo } from '../utils/platform';

export const capacitorService = {
  getInfo() {
    return {
      version: Capacitor.getServerUrl() || 'Local Bundle',
      platformInfo: getPlatformInfo(),
      isPluginAvailable: (pluginName) => Capacitor.isPluginAvailable(pluginName),
    };
  },
};

export default capacitorService;
