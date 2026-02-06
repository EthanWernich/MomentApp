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
  'react-native/Libraries/Renderer/shims/ReactNative': path.join(
    __dirname,
    'shims',
    'ReactNativeShim.js'
  ),
  'react-native/Libraries/Renderer/shims/ReactFabric': path.join(
    __dirname,
    'shims',
    'ReactFabricShim.js'
  ),
};

module.exports = config;
