import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.terraforge.app',
  appName: 'TerraForge',
  webDir: 'out',
  server: {
    // Point to live Vercel deployment -- fixes all navigation issues
    url: 'https://www.terraforgehome.com',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
