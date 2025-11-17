# 🎉 Backend جاهز! - دليل الاستخدام السريع

## ✅ ما تم إنجازه

تم إنشاء Backend كامل بـ:
- ✅ Express.js + TypeScript
- ✅ Prisma ORM + SQLite (جاهز للتحويل لـ PostgreSQL)
- ✅ JWT Authentication
- ✅ Google Gemini AI Integration
- ✅ Streaming Responses
- ✅ Rate Limiting & Security
- ✅ CORS Support

## 🚀 كيفية التشغيل

### 1. تشغيل Backend

```bash
cd backend
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

### 2. اختبار الـ Health Endpoint

```bash
curl http://localhost:5000/health
```

## 📡 API Endpoints المتاحة

### 🔐 Authentication

#### إنشاء JWT Token
```bash
POST http://localhost:5000/api/auth/token
Content-Type: application/json

{
  "userId": "user_xxxxx",
  "email": "test@example.com"
}
```

**مثال curl:**
```bash
curl -X POST http://localhost:5000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","email":"test@test.com"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "test123",
  "expiresIn": "7d"
}
```

---

### 💬 Chat

#### إرسال رسالة (Streaming)
```bash
POST http://localhost:5000/api/chat
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "سيارتي لا تشتغل، ما السبب؟" }
  ]
}
```

**Response Headers:**
- `X-Chat-Id`: معرف المحادثة الجديدة (للمحادثات الجديدة)
- `Content-Type`: `text/event-stream` (streaming)

---

### 📋 Chats

#### جلب جميع المحادثات
```bash
GET http://localhost:5000/api/chats
Authorization: Bearer <your-token>
```

#### جلب محادثة محددة
```bash
GET http://localhost:5000/api/chats/:chatId
Authorization: Bearer <your-token>
```

#### حذف محادثة
```bash
DELETE http://localhost:5000/api/chats/:chatId
Authorization: Bearer <your-token>
```

---

## 🗄️ Database

### عرض قاعدة البيانات
```bash
cd backend
npm run db:studio
```

سيفتح Prisma Studio على: `http://localhost:5555`

### إعادة تهيئة Database
```bash
npm run db:reset
```

---

## 🔄 التحويل إلى PostgreSQL

عندما تريد استخدام PostgreSQL بدلاً من SQLite:

### 1. عدّل `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"  // غيّر من "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. عدّل `.env`
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### 3. أعد إنشاء Database
```bash
npm run db:push
```

---

## 🛠️ Scripts المفيدة

```bash
# تطوير مع auto-reload
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# عرض Database
npm run db:studio

# إعادة Database
npm run db:reset

# إنشاء Migration
npm run db:migrate
```

---

## 🔧 Environment Variables

الملف `.env` موجود بالفعل مع قيم افتراضية. القيم المهمة:

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite محلي

# JWT (غيّره في الإنتاج!)
JWT_SECRET=dev-jwt-secret-change-in-production-12345678

# Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyBA_D2qdm8Vb_WvBiu7g5Rqz8rxuSe1Z2s

# Clerk
CLERK_SECRET_KEY=sk_test_Z2X1KHC19CPegVj2twmEl286Ll6CddtBkGr2Q35rZr

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🐛 استكشاف الأخطاء

### Port مستخدم بالفعل
```bash
# في .env غيّر
PORT=5001
```

### Database Error
```bash
rm prisma/dev.db
npm run db:push
```

### CORS Error
أضف URL الـ Frontend في `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://your-frontend-url
```

---

## 📂 هيكل المشروع

```
backend/
├── src/
│   ├── config/              # Configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Middleware
│   ├── routes/              # API routes
│   └── server.ts            # Main server
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── dev.db              # SQLite database
├── .env                     # Environment variables
├── package.json
└── README.md
```

---

## 🎯 الخطوات التالية

الآن Backend جاهز! الخطوات التالية:

1. ✅ **Frontend Integration** - ربط Frontend مع Backend
2. ✅ **Testing** - اختبار جميع الـ endpoints
3. ✅ **Deployment** - نشر على Railway أو Render

---

## 💡 نصائح

- 🔒 **Security**: غيّر `JWT_SECRET` في الإنتاج
- 🗄️ **Database**: استخدم PostgreSQL في الإنتاج
- 📊 **Monitoring**: أضف logging في الإنتاج
- 🚀 **Performance**: استخدم Redis للـ caching

---

## 🎊 تهانينا!

Backend الخاص بك جاهز ويعمل! 🚀

**Test it now:**
```bash
cd backend
npm run dev
```

ثم افتح: http://localhost:5000/health
