import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.divideorango.sorteio',
  appName: 'divide-o-rango-sorteio',
  webDir: 'dist',
  server: {
    url: 'https://965ac56c-15ee-46c2-86e1-03360aae7923.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B35',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;