export default {
  expo: {
    name: 'Moment',
    slug: 'moment-life-countdown',
    version: '1.0.0',
    newArchEnabled: false,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'moment-life-countdown',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#020202',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ethanwernich.moment',
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#020202',
      },
      package: 'com.ethanwernich.moment',
      permissions: [],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '3f914cee-9655-4bd2-8d47-43b5f9b17c85',
      },
    },
  },
};
