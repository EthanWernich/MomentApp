const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-native/Libraries/ReactNative/findNodeHandle': path.join(
    __dirname,
    'shims',
    'findNodeHandle.js'
  ),
};

module.exports = config;
