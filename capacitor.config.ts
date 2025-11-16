import type { CapacitorConfig } from '@capacitor/cli';

/**
 * تكوين Capacitor للتطبيق المحمول
 * 
 * ملاحظة: تأكد من إضافة NEXT_PUBLIC_API_URL في .env.local
 * قبل بناء التطبيق للإشارة إلى Vercel API
 */
const config: CapacitorConfig = {
  appId: 'com.mechanic.ai',
  appName: 'مساعد الميكانيك الذكي',
  webDir: 'out',
  
  server: {
    // استخدام HTTPS للأمان
    androidScheme: 'https',
    
    // السماح بـ HTTP للتطوير المحلي
    cleartext: true,
    
    // للتطوير: يمكنك استخدام هذا للإشارة إلى خادم محلي
    // url: 'http://localhost:3000',
    // cleartext: true,
  },
  
  android: {
    // السماح بالمحتوى المختلط (HTTP + HTTPS)
    allowMixedContent: true,
    
    // إعدادات البناء
    buildOptions: {
      // keystorePath: 'path/to/keystore',
      // keystorePassword: 'password',
      // keystoreAlias: 'alias',
      // keystoreAliasPassword: 'password',
    },
  },
  
  // إعدادات إضافية
  plugins: {
    // يمكنك إضافة تكوينات خاصة بالـ plugins هنا
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      androidSpinnerStyle: 'small',
    },
  },
};

export default config;
