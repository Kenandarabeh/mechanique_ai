# نظام البناء الذكي - ملخص سريع

## 🎯 الفكرة الأساسية

**نفس الكود** يعمل على:
- ✅ الويب (Vercel) - مع API Routes
- ✅ الموبايل (Android) - يتصل بـ Vercel API

**بدون تعديل أي كود!** 🚀

---

## 📝 الأوامر

### 1️⃣ للويب (Vercel)
```bash
npm run build       # بناء عادي
npm run dev         # تطوير محلي
vercel --prod       # نشر على Vercel
```

### 2️⃣ للموبايل (Android)
```bash
# أولاً: أضف URL في .env.local
echo "NEXT_PUBLIC_API_URL=https://your-project.vercel.app" >> .env.local

# ثانياً: ابني التطبيق
npm run build:mobile      # بناء فقط
npm run android:build     # بناء + فتح Android Studio
```

---

## 🔧 كيف يعمل؟

### الملفات المهمة:

1. **`lib/config.ts`** - يكتشف البيئة تلقائياً
2. **`next.config.ts`** - يتحول بين server/static
3. **All API calls** - تستخدم `getApiUrl()` الذكية

### مثال:
```typescript
import { getApiUrl } from "@/lib/config";

// الويب: fetch("/api/chat")
// الموبايل: fetch("https://your-project.vercel.app/api/chat")
fetch(getApiUrl("/api/chat"))
```

---

## ⚙️ المتغيرات المطلوبة

### في Vercel (Settings → Environment Variables):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
GOOGLE_GENERATIVE_AI_API_KEY=xxx
DATABASE_URL=xxx
```

### في `.env.local` (للموبايل فقط):
```env
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

---

## 🚀 سير العمل الموصى به

1. **طور محلياً**: `npm run dev`
2. **انشر على Vercel**: `vercel --prod`
3. **احصل على الرابط**: `https://your-project.vercel.app`
4. **أضف الرابط في `.env.local`**
5. **ابني التطبيق**: `npm run android:build`

---

## ✅ تم تعديل هذه الملفات:

- ✅ `lib/config.ts` - نظام الكشف التلقائي
- ✅ `next.config.ts` - Build mode ذكي
- ✅ `package.json` - أوامر جديدة
- ✅ `app/assistant.tsx` - استخدام `getApiUrl()`
- ✅ `components/assistant-ui/saved-chats-list.tsx` - استخدام `getApiUrl()`
- ✅ `capacitor.config.ts` - تكوين محسّن

---

## 💡 نصائح

- **للتطوير**: استخدم `npm run dev` عادي
- **للويب**: استخدم `npm run build` عادي
- **للموبايل**: لا تنسى `NEXT_PUBLIC_API_URL` ثم `npm run build:mobile`

---

## 🎊 النتيجة

**كود واحد = ويب + موبايل** بدون صداع! 🎉
