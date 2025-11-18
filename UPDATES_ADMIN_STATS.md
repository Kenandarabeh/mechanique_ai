# 📊 Admin Panel & Oil Tracker Updates

## ما تم إضافته:

### 1. **Oil Tracker - Online Database** 🛢️
تم نقل بيانات تتبع الزيت من `localStorage` إلى قاعدة البيانات PostgreSQL!

#### المميزات الجديدة:
- ✅ تخزين بيانات تغيير الزيت أونلاين
- ✅ الوصول من أي جهاز
- ✅ عدم فقدان البيانات
- ✅ ربط كل سجل بالمستخدم

#### Database Model:
```prisma
model OilChange {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  carModel      String?  // نوع السيارة
  purchaseDate  DateTime? // تاريخ الشراء
  changeDate    DateTime // تاريخ التغيير
  kilometersDone Int     // الكيلومترات عند التغيير
  notes         String?  // ملاحظات
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### API Endpoints:
- `GET /api/oil-change` - جلب جميع سجلات المستخدم
- `POST /api/oil-change` - إضافة سجل جديد
- `PUT /api/oil-change` - تحديث سجل
- `DELETE /api/oil-change?id=xxx` - حذف سجل

### 2. **Admin Dashboard - Statistics** 📊
تم إضافة لوحة إحصائيات شاملة في Admin Panel!

#### الإحصائيات المتوفرة:

##### **Overview Cards** (الكروت الرئيسية):
- 👥 **Total Users**: إجمالي المستخدمين (+عدد المستخدمين الجدد هذا الأسبوع)
- 💬 **Total Chats**: إجمالي المحادثات (+المحادثات الجديدة هذا الأسبوع)
- ✉️ **Total Messages**: إجمالي الرسائل (+ متوسط الرسائل لكل محادثة)
- 🛢️ **Oil Changes**: إجمالي سجلات تغيير الزيت

##### **Secondary Stats** (إحصائيات ثانوية):
- ✅ **Verified Users**: عدد المستخدمين المفعّلين (+ النسبة المئوية)
- 🔧 **Car Parts**: عدد قطع الغيار (+ عدد المتوفر في المخزون)
- 📦 **Stock Status**: نسبة القطع المتوفرة

##### **Recent Activity** (النشاط الأخير):
- 👥 **Recent Users**: آخر 10 مستخدمين مسجلين (مع حالة التفعيل)
- 💬 **Recent Chats**: آخر 10 محادثات (مع عدد الرسائل)

##### **Popular Data** (البيانات الشائعة):
- 🚗 **Popular Car Models**: أشهر أنواع السيارات (من سجلات Oil Tracker)

### 3. **Admin Panel Tabs** 🗂️
تم تقسيم Admin Panel إلى تبويبات:

#### Tab 1: 📊 Statistics
- لوحة الإحصائيات الشاملة
- معلومات حية عن النظام
- تحليلات المستخدمين والمحادثات

#### Tab 2: 🔧 Car Parts
- إدارة قطع الغيار (كما كانت سابقاً)
- إضافة/تعديل/حذف القطع
- البحث والفلترة

## 🚀 كيفية الاستخدام

### Oil Tracker (للمستخدمين):
1. اذهب إلى `/oil-tracker`
2. سجل تغيير الزيت
3. البيانات تُحفظ تلقائياً في قاعدة البيانات
4. يمكنك الوصول لها من أي جهاز بنفس الحساب

### Admin Dashboard (للمشرف):
1. سجّل دخول كـ Admin
2. اذهب إلى `/admin`
3. اضغط على تبويب **📊 Statistics**
4. شاهد جميع الإحصائيات الحية

## 📡 API Documentation

### Oil Change API

#### GET /api/oil-change
جلب جميع سجلات تغيير الزيت للمستخدم الحالي
```bash
curl -X GET http://localhost:3000/api/oil-change \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

#### POST /api/oil-change
إضافة سجل جديد
```bash
curl -X POST http://localhost:3000/api/oil-change \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "carModel": "Renault Symbol",
    "purchaseDate": "2023-01-01",
    "changeDate": "2024-11-18",
    "kilometersDone": 50000,
    "notes": "تغيير زيت Total Quartz 10W40"
  }'
```

#### PUT /api/oil-change
تحديث سجل موجود
```bash
curl -X PUT http://localhost:3000/api/oil-change \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "id": "record-id",
    "kilometersDone": 51000,
    "notes": "تحديث الكيلومترات"
  }'
```

#### DELETE /api/oil-change?id=xxx
حذف سجل
```bash
curl -X DELETE "http://localhost:3000/api/oil-change?id=record-id" \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

### Admin Stats API

#### GET /api/admin/stats
جلب جميع الإحصائيات (Admin فقط)
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Cookie: auth-token=ADMIN_TOKEN"
```

**Response:**
```json
{
  "overview": {
    "totalUsers": 150,
    "verifiedUsers": 120,
    "totalChats": 450,
    "totalMessages": 3200,
    "totalOilChanges": 89,
    "totalCarParts": 125,
    "inStockParts": 98,
    "avgMessagesPerChat": 7.11,
    "newUsersThisWeek": 12,
    "newChatsThisWeek": 35
  },
  "recentUsers": [...],
  "recentChats": [...],
  "popularCarModels": [
    { "model": "Renault Symbol", "count": 25 },
    { "model": "Peugeot 208", "count": 18 }
  ]
}
```

## 🔄 Migration من localStorage

إذا كان لديك بيانات قديمة في `localStorage`، يجب نقلها يدوياً:

### خطوات النقل:
1. افتح `/oil-tracker` في المتصفح
2. افتح Developer Console (`F12`)
3. نفذ هذا الكود:
```javascript
// جلب البيانات القديمة
const oldData = localStorage.getItem(`oil-tracker-${userEmail}`);
if (oldData) {
  const data = JSON.parse(oldData);
  console.log('Old data:', data);
  
  // نقل البيانات عبر API
  data.history.forEach(async (record) => {
    await fetch('/api/oil-change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carModel: data.carInfo.model,
        purchaseDate: data.carInfo.purchaseDate,
        changeDate: record.date,
        kilometersDone: record.kilometers,
        notes: record.notes
      })
    });
  });
}
```

## 🎯 الخطوات القادمة

1. ✅ تحديث Oil Tracker page لاستخدام Database بدلاً من localStorage
2. ✅ إضافة زر "Sync Data" لنقل البيانات القديمة
3. ✅ إضافة Export/Import للبيانات
4. ✅ إضافة Backup تلقائي

## ⚠️ ملاحظات هامة

1. **Authentication مطلوب**: جميع API endpoints تتطلب JWT token صالح
2. **Admin Only**: `/api/admin/stats` يتطلب `isAdmin = true`
3. **User Isolation**: كل مستخدم يرى سجلاته فقط
4. **PostgreSQL**: تأكد من وجود اتصال بقاعدة البيانات

---

**تم التحديث بتاريخ:** 18 نوفمبر 2025
**MechaMind Team** 🔧
