# 🔄 التحويل من SQLite إلى PostgreSQL

## متى تحتاج PostgreSQL؟

- ✅ **للإنتاج (Production)** - PostgreSQL أكثر استقراراً وأماناً
- ✅ **للتعاون (Team Work)** - قاعدة بيانات مشتركة
- ✅ **للـ Scalability** - أداء أفضل مع بيانات كبيرة
- ✅ **للـ Deployment** - معظم منصات الاستضافة تدعم PostgreSQL

## الخطوات

### 1. احصل على PostgreSQL Database

#### خيار أ: Vercel Postgres (مجاني)
1. اذهب إلى https://vercel.com/storage/postgres
2. أنشئ قاعدة بيانات جديدة
3. انسخ `DATABASE_URL`

#### خيار ب: Supabase (مجاني)
1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. اذهب إلى Settings → Database
4. انسخ Connection String

#### خيار ج: Railway (مجاني)
1. اذهب إلى https://railway.app
2. أنشئ PostgreSQL service
3. انسخ Connection URL

### 2. عدّل `prisma/schema.prisma`

افتح الملف وغيّر:

```prisma
datasource db {
  provider = "postgresql"  // غيّر من "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. عدّل `.env`

استبدل `DATABASE_URL`:

```env
# قديم (SQLite)
# DATABASE_URL="file:./dev.db"

# جديد (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

**مثال من Vercel:**
```env
DATABASE_URL="postgres://username:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### 4. أعد إنشاء Prisma Client

```bash
cd backend
npx prisma generate
```

### 5. أنشئ الجداول في PostgreSQL

```bash
npx prisma db push
```

### 6. اختبر الاتصال

```bash
npm run dev
```

يجب أن ترى:
```
✅ Database connected successfully
🗄️  Database: sqlite  # سيتغير إلى PostgreSQL
```

## 📊 نقل البيانات من SQLite إلى PostgreSQL

إذا كان لديك بيانات في SQLite وتريد نقلها:

### الخطوة 1: احفظ البيانات الحالية
```bash
# Export من SQLite
npx prisma db pull
```

### الخطوة 2: غيّر إلى PostgreSQL
(اتبع الخطوات أعلاه)

### الخطوة 3: يدوياً (للبيانات المهمة فقط)
للأسف، لا يوجد طريقة تلقائية. يجب نقل البيانات يدوياً أو استخدام script.

---

## 🎯 ملف `.env` نموذجي للإنتاج

```env
# ============================================
# PRODUCTION ENVIRONMENT
# ============================================

# Database - PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/mechanic_ai_prod"

# Server
PORT=5000
NODE_ENV=production

# JWT - استخدم مفتاح قوي!
JWT_SECRET=your-super-secure-random-jwt-secret-key-here-change-this
JWT_EXPIRES_IN=7d

# Clerk
CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key

# CORS - أضف Frontend Production URL
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com

# Rate Limiting (للإنتاج - أكثر صرامة)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

---

## ✅ Checklist قبل الإنتاج

- [ ] غيّر `JWT_SECRET` إلى مفتاح عشوائي قوي
- [ ] استخدم PostgreSQL بدلاً من SQLite
- [ ] عدّل `CORS_ORIGINS` ليحتوي على Frontend URL فقط
- [ ] قلّل `RATE_LIMIT_MAX_REQUESTS` (50 بدلاً من 100)
- [ ] ضع `NODE_ENV=production`
- [ ] احذف `console.log` غير الضرورية
- [ ] أضف environment-specific logging
- [ ] اختبر جميع endpoints

---

## 🚀 نصائح للإنتاج

### 1. استخدم Migrations بدلاً من `db push`

```bash
# للإنتاج، استخدم migrations
npx prisma migrate dev --name init
npx prisma migrate deploy  # في الإنتاج
```

### 2. Connection Pooling

استخدم Connection Pooler للأداء الأفضل:

```env
# Supabase مع Pooler
DATABASE_URL="postgres://...@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 3. Backup Database

احفظ نسخة احتياطية بانتظام:
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## 🐛 حل المشاكل الشائعة

### Error: P1001 - Can't reach database
- ✅ تأكد من صحة `DATABASE_URL`
- ✅ تأكد من أن Database يعمل
- ✅ تحقق من Firewall rules

### Error: SSL connection required
أضف `?sslmode=require` في نهاية URL:
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### Error: Too many connections
استخدم Connection Pooler أو قلل عدد connections في Prisma:
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

---

## 📚 موارد إضافية

- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)

---

نجحت في التحويل؟ رائع! 🎉
