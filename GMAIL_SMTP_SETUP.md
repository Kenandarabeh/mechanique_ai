# 📧 دليل إعداد Gmail SMTP - MechaMind

## ✅ تم الإعداد بنجاح!

تم تكوين النظام لإرسال الإيميلات عبر Gmail SMTP باستخدام:
- **البريد**: `202038065715@cuniv-naama.dz`
- **SMTP**: `smtp.gmail.com:587`

---

## 🚀 كيفية الاستخدام

### 1. **اختبار الاتصال**

افتح المتصفح واذهب إلى:
```
http://localhost:3000/api/test-email
```

أو اختبر لبريد معين:
```
http://localhost:3000/api/test-email?email=your-email@example.com
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "Test email sent successfully to your-email@example.com",
  "config": {
    "host": "smtp.gmail.com",
    "port": "587",
    "user": "202038065715@cuniv-naama.dz",
    "from": "202038065715@cuniv-naama.dz"
  }
}
```

### 2. **التسجيل العادي**

1. اذهب إلى: `http://localhost:3000/auth/signup`
2. أدخل أي بريد إلكتروني
3. أدخل كلمة المرور والاسم
4. اضغط "Sign Up"
5. **سيصل الكود إلى البريد المدخل مباشرة!** 📧

---

## 📋 الملفات المُنشأة

### 1. **lib/gmail-smtp.ts**
- وظيفة إرسال الإيميل عبر Gmail
- اختبار الاتصال بـ SMTP
- تصميم HTML احترافي للإيميل

### 2. **app/api/test-email/route.ts**
- API لاختبار إرسال الإيميلات
- عرض إعدادات SMTP

### 3. **.env.local** (محدث)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=202038065715@cuniv-naama.dz
SMTP_PASS=maqe wrdk gqkg fdui
SMTP_FROM_NAME=MechaMind
SMTP_FROM_EMAIL=202038065715@cuniv-naama.dz
```

---

## 🔧 كيف يعمل النظام؟

### تدفق التسجيل:

```
1. المستخدم يدخل البريد وكلمة المرور
   ↓
2. النظام يولد OTP (6 أرقام)
   ↓
3. يحفظ البيانات مؤقتاً في VerificationCode (مع metadata)
   ↓
4. يرسل OTP عبر Gmail SMTP إلى بريد المستخدم
   ↓
5. المستخدم يدخل OTP
   ↓
6. النظام يتحقق من OTP
   ↓
7. عند النجاح: يُنشئ حساب المستخدم في قاعدة البيانات
   ↓
8. يحذف OTP بعد الاستخدام
   ↓
9. يسجل دخول المستخدم تلقائياً
```

---

## ⚙️ الإعدادات المتقدمة

### تغيير اسم المرسل:

في `.env.local`:
```env
SMTP_FROM_NAME=اسم التطبيق بالعربي
```

### استخدام بريد آخر:

1. احصل على App Password من Google Account
2. غيّر في `.env.local`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

### استخدام SMTP آخر (غير Gmail):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

---

## 🛡️ الأمان

✅ **تم تطبيق:**
- كلمة المرور مخزنة في `.env.local` (غير مرفوعة على Git)
- استخدام App Password (ليس كلمة المرور الأصلية)
- TLS/STARTTLS مفعّل للتشفير
- OTP صالح لمدة 10 دقائق فقط
- حذف OTP بعد الاستخدام

⚠️ **مهم:**
- لا ترفع `.env.local` على GitHub أبداً!
- `.env.local` موجود في `.gitignore` بالفعل

---

## 🐛 استكشاف الأخطاء

### خطأ: "Invalid login: 535-5.7.8 Username and Password not accepted"

**الحل:**
1. تأكد أن App Password صحيح (16 حرف بدون مسافات)
2. تأكد أن التحقق بخطوتين مفعّل
3. أنشئ App Password جديد

### خطأ: "Connection timeout"

**الحل:**
1. تأكد من اتصالك بالإنترنت
2. جرب تغيير Port من 587 إلى 465:
```env
SMTP_PORT=465
SMTP_SECURE=true
```

### خطأ: "Self signed certificate"

**الحل:**
مفعّل بالفعل في الكود:
```typescript
tls: {
  rejectUnauthorized: false
}
```

---

## 📊 حدود Gmail SMTP

| الميزة | الحد الأقصى |
|--------|-------------|
| إيميلات/يوم | 500 (حساب Gmail عادي) |
| إيميلات/يوم | 2000 (Google Workspace) |
| مستلمين/إيميل | 100 |
| حجم الرسالة | 25 MB |

---

## 🔄 البدائل المجانية

### 1. **SendGrid** (100 إيميل/يوم مجاناً)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 2. **Mailgun** (5000 إيميل/شهر)
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### 3. **Brevo (Sendinblue)** (300 إيميل/يوم)
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-brevo-smtp-key
```

---

## ✅ قائمة التحقق

- [x] تثبيت nodemailer
- [x] إضافة إعدادات SMTP في .env.local
- [x] إنشاء lib/gmail-smtp.ts
- [x] تحديث lib/email.ts
- [x] تحديث app/api/auth/signup/route.ts
- [x] إنشاء صفحة اختبار /api/test-email
- [x] الحساب يُنشأ فقط بعد التحقق من OTP

---

## 🎉 كل شيء جاهز!

النظام الآن يرسل إيميلات حقيقية إلى أي عنوان بريد إلكتروني!

**للاختبار:**
```bash
# شغّل السيرفر
npm run dev

# اذهب إلى
http://localhost:3000/api/test-email

# ثم جرب التسجيل
http://localhost:3000/auth/signup
```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Terminal logs
2. تحقق من Gmail "Less secure apps" settings
3. تأكد أن App Password صحيح
4. جرب البديل: SendGrid أو Mailgun
