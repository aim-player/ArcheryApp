module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path:
          process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development',
      },
    ],
  ],
};
