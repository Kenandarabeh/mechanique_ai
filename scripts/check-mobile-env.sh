#!/bin/bash

# ========================================
# سكريبت التحقق من الإعداد قبل البناء
# ========================================

echo "🔍 التحقق من إعدادات البناء للتطبيق المحمول..."
echo ""

# التحقق من وجود ملف .env.local
if [ ! -f .env.local ]; then
    echo "❌ خطأ: ملف .env.local غير موجود!"
    echo "📝 قم بإنشائه ونسخ المتغيرات من .env.template"
    exit 1
fi

# التحقق من NEXT_PUBLIC_API_URL
if ! grep -q "NEXT_PUBLIC_API_URL=" .env.local; then
    echo "⚠️  تحذير: NEXT_PUBLIC_API_URL غير موجود في .env.local"
    echo ""
    echo "📌 يجب إضافة رابط Vercel الخاص بك:"
    echo "   NEXT_PUBLIC_API_URL=https://your-project.vercel.app"
    echo ""
    read -p "هل تريد المتابعة على أي حال؟ (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    API_URL=$(grep "NEXT_PUBLIC_API_URL=" .env.local | cut -d '=' -f 2 | tr -d '"' | tr -d "'")
    echo "✅ NEXT_PUBLIC_API_URL موجود: $API_URL"
fi

# التحقق من Clerk keys
if ! grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" .env.local; then
    echo "⚠️  تحذير: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY غير موجود"
fi

if ! grep -q "GOOGLE_GENERATIVE_AI_API_KEY=" .env.local; then
    echo "⚠️  تحذير: GOOGLE_GENERATIVE_AI_API_KEY غير موجود"
fi

echo ""
echo "✅ التحقق اكتمل! يمكنك البناء الآن."
echo ""
echo "📱 لبناء التطبيق استخدم:"
echo "   npm run build:mobile"
echo ""
echo "🚀 أو لبناء وفتح Android Studio مباشرة:"
echo "   npm run android:build"
echo ""
