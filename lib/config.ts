/**
 * تكوين البيئة التلقائي
 * يكتشف تلقائياً إذا كان التطبيق يعمل على الويب أو كتطبيق محمول
 */

// تحديد إذا كنا في بيئة الإنتاج
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// تحديد إذا كنا في بيئة بناء ثابت (للتطبيق المحمول)
export const IS_STATIC_BUILD = process.env.NEXT_PUBLIC_BUILD_MODE === 'static';

// URL الخاص بالـ API (للتطبيق المحمول يستخدم Vercel، للويب يستخدم API محلي)
export const API_BASE_URL = IS_STATIC_BUILD 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-project.vercel.app'
  : '';

/**
 * الحصول على URL كامل للـ API
 */
export function getApiUrl(path: string): string {
  // إذا كنا في بيئة المتصفح وليس static build، استخدم relative URL
  if (typeof window !== 'undefined' && !IS_STATIC_BUILD) {
    return path;
  }
  
  // إذا كنا في static build (تطبيق محمول)، استخدم الـ URL الكامل
  return `${API_BASE_URL}${path}`;
}

/**
 * تكوين خاص بـ Capacitor
 */
export const CAPACITOR_CONFIG = {
  enabled: IS_STATIC_BUILD,
  apiUrl: API_BASE_URL,
};

console.log('🔧 Environment Configuration:');
console.log('  - IS_PRODUCTION:', IS_PRODUCTION);
console.log('  - IS_STATIC_BUILD:', IS_STATIC_BUILD);
console.log('  - API_BASE_URL:', API_BASE_URL);
