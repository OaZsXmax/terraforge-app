import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.terraforge.app',
  appName: 'TerraForge',
  webDir: 'out',
  server: {
    url: 'https://www.terraforgehome.com',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: true,
  },
};

export default config;