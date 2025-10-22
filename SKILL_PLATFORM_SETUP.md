# 🚀 راهنمای راه‌اندازی Skill Development Platform

این پروژه شامل تبدیل کامل بخش Books به یک پلتفرم جامع توسعه مهارت‌های شخصی است که شامل **کتاب**، **پادکست** و **مستند** می‌شود.

---

## ✅ تغییرات انجام شده

### 1. Database Schema (Prisma)
- ✅ حذف مدل‌های قدیمی: `Book` و `ReadingSession`
- ✅ اضافه شدن مدل‌های جدید:
  - `SkillContent` - محتوای اصلی (کتاب/پادکست/مستند)
  - `ContentSection` - بخش‌های محتوا (فصل‌ها)
  - `UserProgress` - پیشرفت کاربر
  - `SectionCompletion` - تکمیل بخش‌ها
  - `ContentReview` - نظرات و امتیازدهی

### 2. API Endpoints
تمام API endpoints زیر ایجاد شده‌اند:

#### محتوا (Content)
- `GET /api/skill/content` - لیست محتوا با فیلترها
- `POST /api/skill/content` - ایجاد محتوای جدید
- `GET /api/skill/content/[id]` - جزئیات کامل محتوا
- `PATCH /api/skill/content/[id]` - به‌روزرسانی محتوا
- `DELETE /api/skill/content/[id]` - حذف محتوا

#### پیشرفت (Progress)
- `GET /api/skill/progress` - لیست پیشرفت کاربر
- `POST /api/skill/progress` - شروع محتوای جدید
- `PATCH /api/skill/progress/[id]` - به‌روزرسانی پیشرفت
- `DELETE /api/skill/progress/[id]` - حذف پیشرفت

#### آنالیز (Analytics)
- `GET /api/skill/analytics` - آمار و تحلیل کامل

### 3. UI Components
- ✅ `ContentCard` - کارت نمایش محتوا
- ✅ `FilterBar` - فیلتر و جستجو

### 4. صفحات (Pages)
- ✅ `/dashboard/skill/books` - لیست کتاب‌ها
- ✅ `/dashboard/skill/books/[id]` - جزئیات کتاب
- ✅ `/dashboard/skill/podcasts` - لیست پادکست‌ها
- ✅ `/dashboard/skill/documentaries` - لیست مستندها
- ✅ `/dashboard/skill/analytics` - صفحه آنالیز و آمار

### 5. Navigation
- ✅ اضافه شدن منوی Skill Development با dropdown
- ✅ لینک‌های کتاب‌ها، پادکست‌ها، مستندها و آنالیز

### 6. Seed Data
- ✅ محتوای پیشنهادی سیستم آماده است:
  - 5 کتاب
  - 3 پادکست
  - 3 مستند

---

## 🔧 مراحل راه‌اندازی

### مرحله 1: نصب Dependencies

اگر هنوز dependencies نصب نشده، اجرا کنید:

```bash
npm install
```

### مرحله 2: اجرای Migration

برای اعمال تغییرات Schema به دیتابیس:

```bash
npx prisma migrate dev --name skill_platform_setup
```

یا اگر migration کار نکرد:

```bash
npx prisma db push
```

### مرحله 3: Generate Prisma Client

```bash
npx prisma generate
```

### مرحله 4: اضافه کردن Seed Data (اختیاری اما توصیه می‌شود)

برای اضافه کردن محتوای پیشنهادی اولیه:

```bash
npx prisma db seed
```

اگر خطا دریافت کردید، ابتدا `package.json` را به‌روزرسانی کنید:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

سپس دوباره اجرا کنید:

```bash
npm install -D ts-node
npx prisma db seed
```

### مرحله 5: اجرای پروژه

```bash
npm run dev
```

سپس به آدرس زیر بروید:

```
http://localhost:3000
```

---

## 📁 ساختار فایل‌های جدید

```
app/
├── api/
│   └── skill/
│       ├── content/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── progress/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── analytics/
│           └── route.ts
└── dashboard/
    └── skill/
        ├── books/
        │   ├── page.tsx
        │   └── [id]/
        │       └── page.tsx
        ├── podcasts/
        │   └── page.tsx
        ├── documentaries/
        │   └── page.tsx
        └── analytics/
            └── page.tsx

components/
└── skill/
    ├── ContentCard.tsx
    └── FilterBar.tsx

prisma/
├── schema.prisma (به‌روزرسانی شده)
└── seed.ts (جدید)
```

---

## 🎯 ویژگی‌های کلیدی

### 1. مدیریت محتوا
- ✅ سه نوع محتوا: کتاب، پادکست، مستند
- ✅ محتوای کاربر + محتوای پیشنهادی سیستم
- ✅ تگ‌گذاری و دسته‌بندی
- ✅ سطح دشواری (مبتدی، متوسط، پیشرفته)
- ✅ کاور، خلاصه صوتی، کلیپ ویدیو

### 2. پیگیری پیشرفت
- ✅ درصد پیشرفت
- ✅ بخش/فصل فعلی
- ✅ زمان سپری شده
- ✅ وضعیت (شروع نشده، در حال انجام، تکمیل شده، متوقف شده)
- ✅ یادداشت‌های شخصی

### 3. آنالیز و آمار
- ✅ کل محتوای خوانده شده
- ✅ ساعات یادگیری
- ✅ استریک یادگیری (روزهای متوالی)
- ✅ آمار بر اساس دسته‌بندی
- ✅ موضوعات محبوب
- ✅ نرخ تکمیل
- ✅ فعالیت‌های اخیر

### 4. رابط کاربری
- ✅ طراحی مدرن و ریسپانسیو
- ✅ فیلتر و جستجو
- ✅ کارت‌های جذاب برای محتوا
- ✅ نمایش پیشرفت با Progress Bar
- ✅ Badge ها و آیکون‌های مناسب

---

## 🔄 تفاوت‌ها با سیستم قبلی (Books)

| قبل (Books) | بعد (Skill Platform) |
|-------------|---------------------|
| فقط کتاب | کتاب + پادکست + مستند |
| `totalPages`, `currentPage` | `progressPercentage`, `sections` |
| `ReadingSession` | `SectionCompletion` + `UserProgress` |
| فقط محتوای کاربر | محتوای کاربر + سیستم |
| بدون تگ | سیستم تگ‌گذاری |
| بدون رسانه | خلاصه صوتی + کلیپ ویدیو |
| بدون آنالیز | صفحه آنالیز کامل |

---

## 🎨 فایل‌های قدیمی که باید حذف شوند (اختیاری)

اگر می‌خواهید سیستم قبلی Books را کاملاً حذف کنید:

```bash
# حذف صفحه قدیمی books
rm -rf app/dashboard/books

# حذف API قدیمی books
rm -rf app/api/books
```

**توجه:** این کار اختیاری است. می‌توانید هر دو سیستم را نگه دارید.

---

## 🐛 رفع مشکلات احتمالی

### خطای Migration
اگر migration با خطا مواجه شد:

```bash
# Reset database (فقط برای development!)
npx prisma migrate reset

# سپس دوباره migrate کنید
npx prisma migrate dev --name skill_platform_setup
```

### خطای Generate
اگر Prisma Client generate نشد:

```bash
# حذف و نصب مجدد
rm -rf node_modules/.prisma
npx prisma generate
```

### خطای Seed
اگر seed کار نکرد، می‌توانید دستی محتوا اضافه کنید یا از Prisma Studio استفاده کنید:

```bash
npx prisma studio
```

---

## 📊 داده‌های نمونه

محتوای پیشنهادی سیستم شامل:

### کتاب‌ها:
1. عادت‌های اتمی - جیمز کلیر
2. قدرت عادت - چارلز داهیگ
3. تفکر سریع و کند - دانیل کانمن
4. هنر ظریف بی‌خیالی - مارک منسون
5. جرات نکردن - برنه براون

### پادکست‌ها:
1. Huberman Lab
2. The Tim Ferriss Show
3. Hidden Brain

### مستندها:
1. The Social Dilemma
2. Planet Earth
3. Free Solo

---

## 🚀 مراحل بعدی (پیشنهادات توسعه)

### فاز بعدی:
1. ⬜ مودال افزودن/ویرایش محتوا (فعلاً دکمه اضافه کردن کار نمی‌کند)
2. ⬜ امکان آپلود فایل (تصویر، صدا)
3. ⬜ پلیر صوتی برای خلاصه صوتی
4. ⬜ Embed یوتوب برای کلیپ‌ها
5. ⬜ سیستم نظرات و امتیازدهی
6. ⬜ نمودارهای گرافیکی در Analytics
7. ⬜ امکان Import/Export محتوا
8. ⬜ نوتیفیکیشن‌ها و یادآوری‌ها

---

## 📝 نکات مهم

1. **محتوای سیستم vs محتوای کاربر:**
   - محتوای سیستم (`isSystemContent: true`) برای همه کاربران نمایش داده می‌شود
   - محتوای کاربر فقط برای همان کاربر قابل مشاهده است

2. **لینک‌ها:**
   - `/dashboard/skill/books` - لیست کتاب‌ها
   - `/dashboard/skill/podcasts` - لیست پادکست‌ها
   - `/dashboard/skill/documentaries` - لیست مستندها
   - `/dashboard/skill/analytics` - آنالیز پیشرفت

3. **Navigation:**
   - منوی "Skill Development" در نوار بالا با dropdown
   - کلیک روی ContentCard مستقیماً به صفحه جزئیات می‌رود

---

## ✅ چک‌لیست راه‌اندازی

- [ ] Dependencies نصب شده (`npm install`)
- [ ] Migration اجرا شده (`npx prisma migrate dev` یا `npx prisma db push`)
- [ ] Prisma Client generate شده (`npx prisma generate`)
- [ ] Seed data اضافه شده (اختیاری: `npx prisma db seed`)
- [ ] پروژه اجرا شده (`npm run dev`)
- [ ] صفحه Skill در Navigation دیده می‌شود
- [ ] کتاب‌های پیشنهادی نمایش داده می‌شوند

---

## 🎉 تمام!

اکنون شما یک **Skill Development Platform** کامل دارید که می‌توانید کتاب‌ها، پادکست‌ها و مستندهای خود را مدیریت کنید و پیشرفت خود را پیگیری نمایید.

موفق باشید! 🚀📚🎧🎬
