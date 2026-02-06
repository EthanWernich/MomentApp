'use strict';

const rendererImplementation = require('react-native/Libraries/ReactNative/RendererImplementation');

const safeFindNodeHandle = (componentOrHandle) => {
  if (componentOrHandle == null) {
    return null;
  }
  if (typeof componentOrHandle === 'number') {
    return componentOrHandle;
  }
  if (typeof componentOrHandle === 'object') {
    const directHandle =
      componentOrHandle._nativeTag ?? componentOrHandle.nativeTag;
    if (typeof directHandle === 'number') {
      return directHandle;
    }
    if ('current' in componentOrHandle) {
      const current = componentOrHandle.current;
      if (typeof current === 'number') {
        return current;
      }
      if (current && typeof current === 'object') {
        const currentHandle = current._nativeTag ?? current.nativeTag;
        if (typeof currentHandle === 'number') {
          return currentHandle;
        }
      }
    }
  }
  return null;
};

const proxy = {
  ...rendererImplementation,
  findNodeHandle: safeFindNodeHandle,
};

module.exports = proxy;
module.exports.default = proxy;
