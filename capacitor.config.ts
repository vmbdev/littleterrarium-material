import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'one.littleterrarium.app',
  appName: 'Little Terrarium',
  webDir: 'dist/littleterrarium-material/browser',
  android: {
    minWebViewVersion: 55
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      launchFadeOutDuration: 0,
      backgroundColor: '#7fb251',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    }
  }
};

export default config;
