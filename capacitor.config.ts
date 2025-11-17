import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mechanique.ai',
  appName: 'Mechanique AI',
  webDir: 'out',
  server: {
    // Use your deployed Vercel URL
    url: 'https://mechanique-ai-25fv.vercel.app',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
