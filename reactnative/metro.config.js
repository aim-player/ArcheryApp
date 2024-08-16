const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    alias: {
      '@': './',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
