const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    name: 'WebSerial ESPTool',
    executableName: 'webserial-esptool',
    asar: true,
    // Ensure consistent executable name across platforms
    win32metadata: {
      FileDescription: 'WebSerial ESPTool',
      ProductName: 'WebSerial ESPTool',
    },
    appBundleId: 'com.tasmota.webserial-esptool',
    appCategoryType: 'public.app-category.developer-tools',
    // Files to exclude from the app
    ignore: [
      /^\/src\/(?!wasm)/,  // Exclude src/ but keep src/wasm/
      /^\/script/,
      /^\/\.github/,
      /^\/node_modules\/(?!electron)/,
      /\.git/,
      /\.eslint/,
      /\.prettier/,
      /tsconfig\.json/,
      /rollup\.config\.(js|mjs)$/,
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
          name: 'webserial-esptool',
          bin: 'webserial-esptool',
          maintainer: 'Johann Obermeier',
          homepage: 'https://github.com/Jason2866/WebSerial_ESPTool',
          categories: ['Development', 'Utility'],
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: 'webserial-esptool',
          bin: 'webserial-esptool',
          homepage: 'https://github.com/Jason2866/WebSerial_ESPTool',
          categories: ['Development', 'Utility'],
        },
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
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
