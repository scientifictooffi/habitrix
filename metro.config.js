const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Firebase JS SDK exposes its React Native build (with
    // getReactNativePersistence and correct transports) via the "react-native"
    // package-export condition. Metro must be told to prefer it.
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['require', 'react-native'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
