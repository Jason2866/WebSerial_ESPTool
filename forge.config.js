const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    name: 'WebSerial ESPTool',
    executableName: 'webserial-esptool',
    asar: true,
    icon: './electron/icons/icon',
    appBundleId: 'com.tasmota.webserial-esptool',
    appCategoryType: 'public.app-category.developer-tools',
    // Files to include in the app
    ignore: [
      /^\/src/,
      /^\/script/,
      /^\/node_modules\/(?!electron)/,
      /\.git/,
      /\.eslint/,
      /\.prettier/,
      /tsconfig\.json/,
      /rollup\.config\.js/,
      /\.md$/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'WebSerialESPTool',
        authors: 'Johann Obermeier',
        description: 'Flash & Read ESP devices using WebSerial',
        iconUrl: 'https://raw.githubusercontent.com/Jason2866/WebSerial_ESPTool/main/electron/icons/icon.ico',
        setupIcon: './electron/icons/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Johann Obermeier',
          homepage: 'https://github.com/Jason2866/WebSerial_ESPTool',
          icon: './electron/icons/icon.png',
          categories: ['Development', 'Utility'],
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://github.com/Jason2866/WebSerial_ESPTool',
          icon: './electron/icons/icon.png',
          categories: ['Development', 'Utility'],
        },
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        icon: './electron/icons/icon.icns',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
