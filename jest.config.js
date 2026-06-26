module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native' +
      '|react-native' +
      '|@react-native/js-polyfills' +
      '|@react-navigation' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-svg' +
      '|@notifee/react-native' +
      '|@invertase/react-native-apple-authentication' +
      '|@callstack/liquid-glass' +
      '|zustand' +
      ')/)',
  ],
};
