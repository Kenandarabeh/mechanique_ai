# دليل بناء تطبيق Android

## المتطلبات الأساسية

### 1. تثبيت Java Development Kit (JDK)
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

تحقق من التثبيت:
```bash
java -version
```

### 2. تثبيت Android Studio
1. قم بتحميل Android Studio من: https://developer.android.com/studio
2. قم بتثبيته واتبع معالج التثبيت
3. افتح Android Studio وقم بتثبيت:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD) للمحاكي

### 3. إعداد متغيرات البيئة
أضف هذه السطور إلى ملف `~/.bashrc` أو `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

ثم قم بتحميل الإعدادات:
```bash
source ~/.bashrc
```

## خطوات بناء التطبيق

### 1. بناء مشروع Next.js
```bash
npm run build
```
هذا سينشئ مجلد `out` يحتوي على الملفات الثابتة.

### 2. مزامنة Capacitor مع Android
```bash
npm run android:sync
```
أو:
```bash
npx cap sync android
```

### 3. فتح المشروع في Android Studio
```bash
npm run android:open
```
أو:
```bash
npx cap open android
```

### 4. بناء التطبيق من Android Studio
1. في Android Studio، انتظر حتى ينتهي Gradle من المزامنة
2. اختر **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. بعد انتهاء البناء، ستجد APK في:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## اختبار التطبيق

### على المحاكي:
1. في Android Studio، اضغط على زر "Run" (▶️)
2. اختر محاكي أو قم بإنشاء واحد جديد
3. سيتم تشغيل التطبيق تلقائياً

### على جهاز حقيقي:
1. فعّل "وضع المطور" على هاتفك Android
2. فعّل "USB Debugging"
3. وصّل هاتفك بالكمبيوتر
4. في Android Studio، اختر جهازك من القائمة المنسدلة
5. اضغط على "Run"

## إنشاء APK للإصدار (Release)

### 1. إنشاء Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. تكوين التوقيع في Android Studio
1. افتح `android/app/build.gradle`
2. أضف:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("path/to/my-release-key.keystore")
            storePassword "your-password"
            keyAlias "my-key-alias"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. بناء APK للإصدار
```bash
cd android
./gradlew assembleRelease
```

ستجد APK في:
```
android/app/build/outputs/apk/release/app-release.apk
```

## الأوامر المفيدة

```bash
# بناء وفتح Android Studio في خطوة واحدة
npm run android:build

# مزامنة التغييرات فقط
npm run android:sync

# فتح Android Studio فقط
npm run android:open

# بناء Next.js فقط
npm run build
```

## ملاحظات هامة

### تحذير: Next.js API Routes
⚠️ **مشروع Next.js الحالي يستخدم API Routes** والتي لا تعمل في Static Export!

**الحلول الممكنة:**

1. **استخدام Backend منفصل:**
   - استضف API routes على خادم منفصل (Vercel, Railway, etc.)
   - قم بتحديث URLs في التطبيق للإشارة إلى الخادم

2. **تحويل إلى SPA (Single Page Application):**
   - استخدم API خارجي بدلاً من Next.js API routes
   - قم بتحديث الكود لاستدعاء APIs مباشرة

3. **استخدام Capacitor Server:**
   - قم بإعداد خادم محلي داخل التطبيق
   - استخدم Capacitor HTTP plugin

### مشاكل شائعة وحلولها

**مشكلة: "SDK location not found"**
```bash
# أنشئ ملف local.properties في مجلد android
echo "sdk.dir=/home/YOUR_USERNAME/Android/Sdk" > android/local.properties
```

**مشكلة: Gradle build fails**
```bash
cd android
./gradlew clean
./gradlew build
```

**مشكلة: Port already in use**
```bash
# أوقف العملية التي تستخدم المنفذ
lsof -ti:8081 | xargs kill -9
```

## الخطوات التالية

1. ✅ تأكد من أن Java و Android SDK مثبتان
2. ✅ قم ببناء المشروع: `npm run build`
3. ✅ افتح Android Studio: `npm run android:open`
4. ✅ انتظر مزامنة Gradle
5. ✅ اختبر على محاكي أو جهاز حقيقي
6. ✅ قم ببناء APK

## روابط مفيدة

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Download](https://developer.android.com/studio)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
