'use strict';

const ReactFabricRenderer = __DEV__
  ? require('react-native/Libraries/Renderer/implementations/ReactFabric-dev')
  : require('react-native/Libraries/Renderer/implementations/ReactFabric-prod');

module.exports = ReactFabricRenderer;
module.exports.default = ReactFabricRenderer;
