import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.littleterrarium.app',
  appName: 'Little Terrarium',
  webDir: 'dist/littleterrarium-material',
  bundledWebRuntime: false,
  android: {
    minWebViewVersion: 55
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    }
  }
};

export default config;
