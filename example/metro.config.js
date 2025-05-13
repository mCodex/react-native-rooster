const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');

const libraryRoot = path.resolve(__dirname, '..', 'build');
const config = {
  watchFolders: [path.resolve(__dirname, '..', 'build')],
  resolver: {
    // Allow metro to resolve the local package
    extraNodeModules: {
      'react-native-rooster': libraryRoot,
    },
  },
  projectRoot: __dirname,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
