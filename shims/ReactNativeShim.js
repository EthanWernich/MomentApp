'use strict';

const ReactNativeRenderer = __DEV__
  ? require('react-native/Libraries/Renderer/implementations/ReactNativeRenderer-dev')
  : require('react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod');

module.exports = ReactNativeRenderer;
module.exports.default = ReactNativeRenderer;
