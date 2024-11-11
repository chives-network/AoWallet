import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.aowallet.app',
  appName: 'AoWallet',
  webDir: 'out',
  plugins: {
    LiveUpdates: {
      enabled: true,
      appId: '3ba80b94',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2
    }
  }
};

export default config;
