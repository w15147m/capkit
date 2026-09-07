import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

export const getPlatform = () => Capacitor.getPlatform();

export const getPlatformInfo = () => {
  const platform = getPlatform();
  const native = isNative();

  return {
    platform,
    isNative: native,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web',
  };
};
