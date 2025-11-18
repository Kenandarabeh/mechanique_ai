# 🎨 MechaMind Design System Guide

## نظرة عامة (Overview)

هذا الدليل الشامل يوثق نظام التصميم الكامل لتطبيق **MechaMind** - مساعد صيانة السيارات الذكي.

---

## 📋 جدول المحتويات

1. [الألوان (Colors)](#الألوان-colors)
2. [الخطوط (Typography)](#الخطوط-typography)
3. [المسافات (Spacing)](#المسافات-spacing)
4. [الأزرار (Buttons)](#الأزرار-buttons)
5. [المكونات (Components)](#المكونات-components)
6. [الصفحات (Pages)](#الصفحات-pages)
7. [الأيقونات والرموز](#الأيقونات-والرموز)
8. [الرسوم المتحركة](#الرسوم-المتحركة)
9. [التخطيط (Layout)](#التخطيط-layout)
10. [الوضع الليلي (Dark Mode)](#الوضع-الليلي)

---

## 1. الألوان (Colors)

### 🎨 نظام الألوان الأساسي: **Grayscale** (أبيض وأسود ورمادي)

#### Primary Colors (الألوان الأساسية)

```css
/* الأسود - Primary Dark */
--gray-900: #111827;  /* الخلفيات الداكنة، النصوص الرئيسية */
--gray-800: #1f2937;  /* الأزرار الداكنة، العناوين */

/* الرمادي - Neutral */
--gray-700: #374151;  /* النصوص الثانوية */
--gray-600: #4b5563;  /* النصوص الخفيفة */
--gray-500: #6b7280;  /* الحدود، الأيقونات */
--gray-400: #9ca3af;  /* النصوص المعطلة */
--gray-300: #d1d5db;  /* الحدود الخفيفة */
--gray-200: #e5e7eb;  /* الخلفيات الثانوية */
--gray-100: #f3f4f6;  /* الخلفيات الفاتحة */
--gray-50:  #f9fafb;  /* الخلفيات الفاتحة جداً */

/* الأبيض - Background */
--white: #ffffff;     /* الخلفية الرئيسية */
```

#### Semantic Colors (ألوان الحالات)

```css
/* Success - الأخضر */
--green-600: #16a34a;  /* نجاح العمليات */
--green-100: #dcfce7;  /* خلفية النجاح */

/* Error - الأحمر */
--red-600: #dc2626;    /* الأخطاء، الحذف */
--red-100: #fee2e2;    /* خلفية الخطأ */

/* Warning - الأصفر */
--yellow-600: #ca8a04; /* التحذيرات */
--yellow-100: #fef9c3; /* خلفية التحذير */

/* Info - الأزرق (استخدام محدود) */
--blue-600: #2563eb;   /* المعلومات */
--blue-100: #dbeafe;   /* خلفية المعلومات */
```

### 🎯 استخدامات الألوان

#### الخلفيات
```css
/* الصفحة الرئيسية */
background: white;

/* الخلفيات الثانوية */
background: gray-50 أو gray-100;

/* الكروت والبطاقات */
background: white;
border: 1px solid gray-200;

/* الأزرار الرئيسية */
background: gray-900;
color: white;

/* الأزرار الثانوية */
background: white;
border: 2px solid gray-900;
color: gray-900;
```

#### النصوص
```css
/* العناوين الرئيسية */
color: gray-900;
font-weight: 700;

/* النصوص العادية */
color: gray-700;

/* النصوص الثانوية */
color: gray-600;

/* النصوص المعطلة */
color: gray-400;
```

---

## 2. الخطوط (Typography)

### 📝 عائلات الخطوط

#### للنصوص العربية
```css
font-family: 'Cairo', 'Tajawal', sans-serif;
```

#### للنصوص الإنجليزية والفرنسية
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 📏 أحجام الخطوط

```css
/* العناوين */
--text-6xl: 3.75rem;  /* 60px - Hero Title */
--text-5xl: 3rem;     /* 48px - Page Title */
--text-4xl: 2.25rem;  /* 36px - Section Title */
--text-3xl: 1.875rem; /* 30px - Card Title */
--text-2xl: 1.5rem;   /* 24px - Subtitle */
--text-xl: 1.25rem;   /* 20px - Large Text */

/* النصوص العادية */
--text-lg: 1.125rem;  /* 18px - Body Large */
--text-base: 1rem;    /* 16px - Body */
--text-sm: 0.875rem;  /* 14px - Small Text */
--text-xs: 0.75rem;   /* 12px - Caption */
```

### 🔤 أوزان الخطوط

```css
--font-normal: 400;   /* النص العادي */
--font-medium: 500;   /* النص المتوسط */
--font-semibold: 600; /* شبه العريض */
--font-bold: 700;     /* العريض */
--font-extrabold: 800; /* العريض جداً */
```

### 📖 أمثلة الاستخدام

```tsx
{/* Hero Title */}
<h1 className="text-6xl md:text-7xl font-bold text-gray-900">
  MechaMind
</h1>

{/* Section Title */}
<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
  المميزات
</h2>

{/* Card Title */}
<h3 className="text-2xl font-bold text-gray-900">
  ذكاء اصطناعي متقدم
</h3>

{/* Body Text */}
<p className="text-base text-gray-700 leading-relaxed">
  نص عادي مع مسافة بين الأسطر
</p>

{/* Small Text */}
<span className="text-sm text-gray-600">
  نص صغير ثانوي
</span>
```

---

## 3. المسافات (Spacing)

### 📐 نظام المسافات (8px Grid)

```css
/* القيم الأساسية */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### 🎯 استخدامات المسافات

```tsx
{/* Padding داخلي */}
<div className="p-4">   {/* 16px جميع الجهات */}
<div className="px-6">  {/* 24px أفقي فقط */}
<div className="py-8">  {/* 32px عمودي فقط */}

{/* Margin خارجي */}
<div className="m-4">   {/* 16px جميع الجهات */}
<div className="mb-6">  {/* 24px أسفل فقط */}
<div className="mt-8">  {/* 32px أعلى فقط */}

{/* Gap بين العناصر */}
<div className="flex gap-4">     {/* 16px بين العناصر */}
<div className="grid gap-8">     {/* 32px بين العناصر */}
<div className="space-y-6">      {/* 24px عمودي بين الأطفال */}
```

---

## 4. الأزرار (Buttons)

### 🔘 أنواع الأزرار

#### 1. Primary Button (الزر الأساسي)
```tsx
<button className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105">
  ابدأ الآن
</button>
```

**الخصائص:**
- خلفية: `bg-gray-900` (أسود)
- نص: `text-white` (أبيض)
- حواف: `rounded-xl` (12px)
- Hover: `hover:bg-gray-800 hover:shadow-2xl hover:scale-105`
- Padding: `px-8 py-4`
- Shadow: `shadow-xl`

#### 2. Secondary Button (الزر الثانوي)
```tsx
<button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-50 font-semibold text-lg transition-all shadow-lg hover:shadow-xl">
  حمّل التطبيق
</button>
```

**الخصائص:**
- خلفية: `bg-white` (أبيض)
- نص: `text-gray-900` (أسود)
- حدود: `border-2 border-gray-900`
- Hover: `hover:bg-gray-50 hover:shadow-xl`

#### 3. Outline Button (زر الحدود)
```tsx
<button className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors">
  إلغاء
</button>
```

#### 4. Icon Button (زر الأيقونة)
```tsx
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
  <span className="text-xl">⚙️</span>
</button>
```

### 📏 أحجام الأزرار

```tsx
{/* Large */}
className="px-8 py-4 text-lg"

{/* Medium (افتراضي) */}
className="px-6 py-3 text-base"

{/* Small */}
className="px-4 py-2 text-sm"

{/* Extra Small */}
className="px-3 py-1 text-xs"
```

### 🎭 حالات الأزرار

```tsx
{/* Default - عادي */}
<button className="bg-gray-900 text-white">

{/* Hover - عند التمرير */}
className="hover:bg-gray-800 hover:scale-105"

{/* Active - عند الضغط */}
className="active:scale-95"

{/* Disabled - معطّل */}
className="disabled:opacity-50 disabled:cursor-not-allowed"

{/* Loading - تحميل */}
<button disabled className="opacity-75">
  <span className="animate-spin">⏳</span> جاري التحميل...
</button>
```

---

## 5. المكونات (Components)

### 📦 Card Component (البطاقة)

```tsx
<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
  <h3 className="text-2xl font-bold text-gray-900 mb-4">
    العنوان
  </h3>
  <p className="text-gray-600 leading-relaxed">
    النص الوصفي
  </p>
</div>
```

**الخصائص:**
- Padding: `p-8` (32px)
- خلفية: `bg-white`
- حواف: `rounded-2xl` (16px)
- ظل: `shadow-lg`
- Hover: `hover:shadow-xl hover:scale-105`
- حدود: `border border-gray-100`

### 🖼️ Feature Card (بطاقة الميزة)

```tsx
<div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
  <h3 className="text-2xl font-bold text-gray-900 mb-4">
    🤖 ذكاء اصطناعي متقدم
  </h3>
  <p className="text-gray-600 leading-relaxed">
    تشخيص دقيق لمشاكل السيارات
  </p>
</div>
```

### 👤 Profile Card (بطاقة البروفايل)

```tsx
<div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
  <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
    <span className="text-white text-5xl font-bold">M</span>
  </div>
  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
    مصطفى
  </h3>
  <p className="text-gray-600 text-center font-medium mb-4">
    مؤسس مشارك ومطور
  </p>
  <p className="text-gray-600 text-center leading-relaxed">
    خبير في تطوير التطبيقات
  </p>
</div>
```

### 📊 Stats Card (بطاقة الإحصائيات)

```tsx
<div className="bg-white p-6 rounded-lg border border-gray-200">
  <div className="text-sm text-gray-600">Total Users</div>
  <div className="text-3xl font-bold text-gray-900 mt-2">
    1,245
  </div>
  <div className="text-xs text-green-600 mt-2">
    +12 this week
  </div>
</div>
```

### 🔔 Alert Component (التنبيه)

```tsx
{/* Success */}
<div className="p-4 bg-green-100 border border-green-200 rounded-lg">
  <p className="text-green-800">✅ تمت العملية بنجاح!</p>
</div>

{/* Error */}
<div className="p-4 bg-red-100 border border-red-200 rounded-lg">
  <p className="text-red-800">❌ حدث خطأ!</p>
</div>

{/* Warning */}
<div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
  <p className="text-yellow-800">⚠️ تحذير!</p>
</div>
```

### 📝 Input Field (حقل الإدخال)

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    الاسم
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    placeholder="أدخل الاسم"
  />
</div>
```

---

## 6. الصفحات (Pages)

### 🏠 Landing Page (الصفحة الرئيسية)

**الأقسام:**

1. **Hero Section** - القسم البطولي
   ```
   - خلفية: gradient-to-b from-gray-50 to-white
   - Padding: pt-32 pb-20
   - Logo كبير مع gradient
   - عنوان رئيسي (6xl)
   - عنوان فرعي (3xl)
   - وصف (lg)
   - أزرار CTA
   ```

2. **Features Section** - قسم المميزات
   ```
   - خلفية: white
   - Padding: py-20
   - Grid: 3 أعمدة
   - Gap: gap-8
   - Cards: hover effects
   ```

3. **Founders Section** - قسم المؤسسين
   ```
   - خلفية: gray-50
   - Padding: py-20
   - Grid: 2 أعمدة
   - Profile Cards
   ```

4. **Download Section** - قسم التحميل
   ```
   - خلفية: gradient-to-br from-gray-900 to-gray-800
   - نص: white
   - Padding: py-20
   - زر تحميل كبير
   ```

5. **Footer** - الذيل
   ```
   - خلفية: gray-900
   - نص: white/gray-400
   - Grid: 3 أعمدة
   - روابط + معلومات اتصال
   ```

### 💬 Chat Page (صفحة المحادثة)

```tsx
{/* Layout */}
<div className="h-screen flex flex-col">
  {/* Header */}
  <header className="h-16 border-b border-gray-200 bg-white">
    
  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* User Message */}
    <div className="bg-gray-100 rounded-lg p-4 mb-4">
      
    {/* AI Message */}
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      
  </div>
  
  {/* Input Area */}
  <div className="border-t border-gray-200 p-4">
</div>
```

### ⚙️ Admin Panel (لوحة الإدارة)

```tsx
{/* Tabs */}
<div className="flex gap-4 border-b border-gray-200">
  <button className="px-4 py-2 border-b-2 border-gray-900">
    📊 Statistics
  </button>
  <button className="px-4 py-2 text-gray-600">
    🔧 Car Parts
  </button>
</div>

{/* Stats Cards */}
<div className="grid grid-cols-4 gap-4">
  {/* بطاقات الإحصائيات */}
</div>
```

---

## 7. الأيقونات والرموز

### 🎭 نظام الأيقونات

نستخدم **Emoji Icons** بدلاً من مكتبات الأيقونات:

```tsx
🤖 - AI / الذكاء الاصطناعي
🔧 - Tools / أدوات
🛢️ - Oil / زيت
💬 - Chat / محادثة
📊 - Statistics / إحصائيات
⚡ - Fast / سريع
📱 - Mobile / هاتف
✅ - Success / نجاح
❌ - Error / خطأ
⚠️ - Warning / تحذير
🔔 - Notification / إشعار
⚙️ - Settings / إعدادات
👤 - User / مستخدم
🚗 - Car / سيارة
📞 - Phone / هاتف
➕ - Add / إضافة
✏️ - Edit / تعديل
🗑️ - Delete / حذف
```

### 📏 أحجام الأيقونات

```tsx
{/* Small */}
<span className="text-sm">🔧</span>

{/* Medium */}
<span className="text-xl">🔧</span>

{/* Large */}
<span className="text-3xl">🔧</span>

{/* Extra Large */}
<span className="text-5xl">🔧</span>
```

---

## 8. الرسوم المتحركة

### ✨ Transitions

```tsx
{/* Default Transition */}
className="transition-all duration-300"

{/* Color Transition */}
className="transition-colors duration-200"

{/* Transform Transition */}
className="transition-transform duration-300"
```

### 🎬 Hover Effects

```tsx
{/* Scale Up */}
className="hover:scale-105"

{/* Scale Down */}
className="active:scale-95"

{/* Shadow Increase */}
className="shadow-lg hover:shadow-2xl"

{/* Background Change */}
className="hover:bg-gray-50"

{/* Combined Effect */}
className="hover:scale-105 hover:shadow-xl transition-all duration-300"
```

### 🌀 Loading States

```tsx
{/* Spinner */}
<div className="animate-spin">⏳</div>

{/* Pulse */}
<div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>

{/* Fade In */}
<div className="animate-fade-in opacity-0">Content</div>
```

---

## 9. التخطيط (Layout)

### 📱 Responsive Breakpoints

```css
/* Mobile First */
sm:  640px  /* Tablet Portrait */
md:  768px  /* Tablet Landscape */
lg:  1024px /* Desktop */
xl:  1280px /* Large Desktop */
2xl: 1536px /* Extra Large */
```

### 🎯 استخدام Breakpoints

```tsx
{/* Mobile: 1 column, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

{/* Mobile: text-4xl, Desktop: text-6xl */}
<h1 className="text-4xl md:text-5xl lg:text-6xl">

{/* Mobile: hidden, Desktop: flex */}
<div className="hidden md:flex">

{/* Mobile: px-4, Desktop: px-8 */}
<div className="px-4 md:px-6 lg:px-8">
```

### 📐 Container System

```tsx
{/* Full Width Container */}
<div className="w-full">

{/* Max Width Container */}
<div className="max-w-7xl mx-auto px-4">

{/* Centered Content */}
<div className="max-w-4xl mx-auto text-center">
```

---

## 10. الوضع الليلي (Dark Mode)

### 🌙 Dark Mode Classes

```tsx
{/* Background */}
className="bg-white dark:bg-gray-900"

{/* Text */}
className="text-gray-900 dark:text-gray-100"

{/* Border */}
className="border-gray-200 dark:border-gray-800"

{/* Card */}
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
  <h3 className="text-gray-900 dark:text-gray-100">
  <p className="text-gray-600 dark:text-gray-400">
</div>
```

---

## 11. أفضل الممارسات

### ✅ Do's (افعل)

1. **استخدم Grayscale فقط** - لا تضف ألوان زاهية
2. **استخدم Tailwind Classes** - لا تكتب CSS مخصص
3. **التزم بنظام المسافات 8px** - 4, 8, 16, 24, 32, etc.
4. **استخدم hover effects دائماً** - لجميع العناصر التفاعلية
5. **اجعل كل شيء responsive** - mobile-first approach
6. **استخدم shadows بحذر** - shadow-lg, shadow-xl, shadow-2xl
7. **rounded corners** - rounded-lg, rounded-xl, rounded-2xl
8. **font-bold للعناوين** - font-medium للنصوص

### ❌ Don'ts (لا تفعل)

1. ❌ لا تستخدم ألوان زاهية (أزرق، أحمر، إلخ) إلا للحالات
2. ❌ لا تكسر نظام المسافات (لا 15px, 23px, إلخ)
3. ❌ لا تستخدم خطوط غير Cairo/Inter
4. ❌ لا تنسى dark mode classes
5. ❌ لا تستخدم !important في CSS
6. ❌ لا تكتب inline styles
7. ❌ لا تنسى hover states
8. ❌ لا تجعل الأزرار صغيرة جداً (min 40px height)

---

## 12. أمثلة كاملة

### Example 1: Feature Card

```tsx
<div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
  <h3 className="text-2xl font-bold text-gray-900 mb-4">
    🤖 ذكاء اصطناعي متقدم
  </h3>
  <p className="text-gray-600 leading-relaxed">
    تشخيص دقيق لمشاكل السيارات باستخدام تقنية Gemini AI من Google
  </p>
</div>
```

### Example 2: Button Group

```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <button className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105">
    ابدأ الآن →
  </button>
  <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-50 font-semibold transition-all shadow-lg">
    حمّل التطبيق
  </button>
</div>
```

### Example 3: Stats Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="text-sm text-gray-600">Total Users</div>
    <div className="text-3xl font-bold text-gray-900 mt-2">1,245</div>
    <div className="text-xs text-green-600 mt-2">+12 this week</div>
  </div>
</div>
```

---

## 📞 الدعم والمساعدة

إذا كان لديك أي استفسار عن الديزاين، تواصل معنا على:
- 📱 **Phone**: 0665543710
- 🔧 **Team**: Mostafa & Amine

---

**آخر تحديث:** 18 نوفمبر 2025  
**الإصدار:** 1.0.0  
**MechaMind Design System** 🎨
