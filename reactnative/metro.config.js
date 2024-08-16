const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    alias: {
      '@src': './src',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
