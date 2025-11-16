# دليل النشر والبناء

## 🌐 للنشر على Vercel (الويب)

### الطريقة الأولى: النشر التلقائي
1. قم بربط المشروع مع Vercel:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. اتبع التعليمات واختر:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - What's your project's name? **mechanic-ai**
   - In which directory is your code located? **./**

3. سيتم النشر تلقائياً! احصل على الرابط مثل: `https://mechanic-ai.vercel.app`

### الطريقة الثانية: من GitHub
1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط **Import Project**
4. اختر repository الخاص بك
5. سيتم النشر تلقائياً!

### إعدادات متغيرات البيئة في Vercel
في لوحة تحكم Vercel، أضف المتغيرات التالية:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_key
DATABASE_URL=your_database_url
```

---

## 📱 لبناء تطبيق Android

### 1. تحديث ملف .env.local
أضف رابط مشروعك على Vercel:

```bash
# في ملف .env.local
NEXT_PUBLIC_API_URL=https://mechanic-ai.vercel.app
```

### 2. بناء التطبيق للموبايل
```bash
npm run build:mobile
```

هذا الأمر سيقوم تلقائياً بـ:
- ✅ بناء Next.js في وضع Static Export
- ✅ ضبط المتغيرات للاتصال بـ Vercel API
- ✅ إنشاء مجلد `out/` مع الملفات الثابتة

### 3. مزامنة مع Android
```bash
npm run android:sync
```

### 4. فتح Android Studio وبناء APK
```bash
npm run android:open
```

أو استخدم أمر واحد لكل شيء:
```bash
npm run android:build
```

---

## 🔄 سير العمل الكامل

### للتطوير المحلي (الويب):
```bash
npm run dev
```
✅ يعمل مع API Routes محلياً
✅ لا حاجة لأي إعدادات إضافية

### للنشر على Vercel:
```bash
npm run build
npm start  # للاختبار المحلي
vercel --prod  # للنشر
```
✅ يعمل مع API Routes على Vercel
✅ كل شيء يعمل كما هو

### لبناء تطبيق Android:
```bash
# 1. تأكد من إضافة NEXT_PUBLIC_API_URL في .env.local
echo "NEXT_PUBLIC_API_URL=https://your-project.vercel.app" >> .env.local

# 2. ابني للموبايل
npm run build:mobile

# 3. افتح Android Studio
npm run android:build
```
✅ يستخدم API من Vercel
✅ بدون تعديل في الكود!

---

## 🎯 كيف يعمل النظام الذكي؟

### ملف `lib/config.ts`
```typescript
// يكتشف تلقائياً البيئة
export const IS_STATIC_BUILD = process.env.NEXT_PUBLIC_BUILD_MODE === 'static';

// يختار URL المناسب
export const API_BASE_URL = IS_STATIC_BUILD 
  ? process.env.NEXT_PUBLIC_API_URL  // للموبايل: https://your-project.vercel.app
  : '';  // للويب: يستخدم relative URLs

// دالة ذكية تعيد URL الصحيح
export function getApiUrl(path: string): string {
  if (IS_STATIC_BUILD) {
    return `${API_BASE_URL}${path}`;  // للموبايل
  }
  return path;  // للويب
}
```

### استخدام في الكود
```typescript
// بدلاً من:
fetch("/api/chat")

// استخدم:
import { getApiUrl } from "@/lib/config";
fetch(getApiUrl("/api/chat"))

// النتيجة:
// - في الويب: fetch("/api/chat") ✅
// - في الموبايل: fetch("https://your-project.vercel.app/api/chat") ✅
```

---

## 📋 الخلاصة

| البيئة | الأمر | النتيجة |
|--------|-------|---------|
| **التطوير** | `npm run dev` | يعمل محلياً مع API Routes |
| **الويب (Vercel)** | `npm run build` | يبني مع API Routes |
| **الموبايل (Android)** | `npm run build:mobile` | يبني Static + يتصل بـ Vercel |

### المميزات ✨
- ✅ **كود واحد** يعمل على الويب والموبايل
- ✅ **بدون تعديل** في الكود عند التبديل بين البيئات
- ✅ **ذكي تلقائياً** - يكتشف البيئة ويتصرف بشكل صحيح
- ✅ **سهل الاستخدام** - أوامر واضحة لكل حالة

### ملاحظة مهمة ⚠️
عند بناء التطبيق للمرة الأولى، لا تنسى:
1. نشر المشروع على Vercel أولاً
2. نسخ رابط Vercel وإضافته في `.env.local`
3. ثم بناء تطبيق Android
