# راهنمای سیستم دوزبانه (فارسی/انگلیسی)

این پروژه اکنون به صورت کامل از دو زبان فارسی و انگلیسی پشتیبانی می‌کند.

## ویژگی‌های پیاده‌سازی شده

### ✅ تکمیل شده

1. **نصب پکیج‌های لازم**
   - `next-intl` - مدیریت ترجمه‌ها
   - `date-fns-jalali` - پشتیبانی از تاریخ شمسی
   - `tailwindcss-rtl` - پشتیبانی RTL

2. **فایل‌های پیکربندی**
   - `i18n.ts` - تنظیمات next-intl
   - `middleware.ts` - مدیریت locale در URL
   - `next.config.js` - پیکربندی next-intl plugin

3. **فایل‌های ترجمه**
   - `messages/fa.json` - ترجمه‌های فارسی
   - `messages/en.json` - ترجمه‌های انگلیسی

4. **تغییرات دیتابیس**
   - اضافه شدن فیلد `language` به مدل User
   - اضافه شدن فیلد `language` به مدل Post
   - ایجاد مدل `BookTranslation` برای محتوای چندزبانه

5. **ساختار فولدرها**
   - تمام صفحات به `app/[locale]/` منتقل شدند
   - API routes همچنان در `app/api/` باقی ماندند

6. **کامپوننت‌های جدید**
   - `LanguageSwitcher` - تغییر زبان
   - `Navigation` - منوی اصلی با پشتیبانی چندزبانه

7. **استایل‌های RTL**
   - تنظیمات Tailwind CSS برای RTL
   - استایل‌های سفارشی در `globals.css`

8. **API Endpoints**
   - `PATCH /api/user/language` - تغییر زبان کاربر
   - `GET /api/user/language` - دریافت زبان کاربر

9. **Utility Functions**
   - `formatDate()` - فرمت تاریخ (شمسی/میلادی)
   - `formatRelativeTime()` - زمان نسبی (5 دقیقه پیش)
   - `formatNumber()` - فرمت اعداد (فارسی/انگلیسی)
   - `getDirection()` - تشخیص جهت متن

## نحوه استفاده

### تغییر زبان

کاربران می‌توانند از طریق دکمه Language Switcher در نوار navigation زبان را تغییر دهند.

### استفاده از ترجمه در کامپوننت‌ها

#### Client Components:

\`\`\`tsx
'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function MyComponent() {
  const t = useTranslations('navigation');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <Link href={\`/\${locale}/dashboard\`}>داشبورد</Link>
    </div>
  );
}
\`\`\`

#### Server Components:

\`\`\`tsx
import { useTranslations } from 'next-intl';
import { getServerSession } from 'next-auth';

export default async function MyPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
\`\`\`

### استفاده از Utility Functions

\`\`\`tsx
import { formatDate, formatNumber } from '@/lib/i18n-utils';

const locale = useLocale();

// فرمت تاریخ
const formattedDate = formatDate(new Date(), locale);
// fa: ۱۴۰۳/۰۷/۳۰
// en: Oct 22, 2024

// فرمت اعداد
const formattedNumber = formatNumber(1234567, locale);
// fa: ۱٬۲۳۴٬۵۶۷
// en: 1,234,567
\`\`\`

### لینک‌ها

همیشه locale را به لینک‌ها اضافه کنید:

\`\`\`tsx
// ❌ اشتباه
<Link href="/dashboard">Dashboard</Link>

// ✅ درست
<Link href={\`/\${locale}/dashboard\`}>Dashboard</Link>
\`\`\`

### استایل‌های RTL

از utility classes مخصوص RTL استفاده کنید:

\`\`\`tsx
// برای spacing
<div className="space-x-4 rtl:space-x-reverse">

// برای text alignment
<div className="text-start">  // به جای text-left

// برای positioning
<div className="ltr:right-0 rtl:left-0">
\`\`\`

## Migration دیتابیس

⚠️ **مهم:** قبل از اجرای migration، حتماً backup از دیتابیس بگیرید.

\`\`\`bash
# اجرای migration
npx prisma migrate dev --name add_multilingual_support

# تولید Prisma Client
npx prisma generate
\`\`\`

### تغییرات در دیتابیس:

1. فیلد `language` به جدول `User` اضافه شد (پیش‌فرض: 'fa')
2. فیلد `language` به جدول `Post` اضافه شد
3. جدول `BookTranslation` برای ذخیره ترجمه‌های کتاب‌ها
4. فیلدهای `title` و `author` از جدول `Book` حذف شدند

## ساختار فایل‌های ترجمه

فایل‌های ترجمه در `messages/` قرار دارند:

- `messages/fa.json` - ترجمه‌های فارسی
- `messages/en.json` - ترجمه‌های انگلیسی

### افزودن ترجمه جدید:

\`\`\`json
{
  "my_section": {
    "my_key": "متن فارسی",
    "another_key": "متن دیگر"
  }
}
\`\`\`

## تست سیستم

### Checklist تست:

- [ ] تغییر زبان در Navigation کار می‌کند
- [ ] URL به `/fa` یا `/en` تبدیل می‌شود
- [ ] RTL/LTR به درستی تغییر می‌کند
- [ ] فونت فارسی نمایش داده می‌شود
- [ ] تمام متن‌ها ترجمه شده‌اند
- [ ] تاریخ‌ها به فرمت صحیح نمایش داده می‌شوند
- [ ] اعداد فارسی/انگلیسی به درستی نمایش داده می‌شوند
- [ ] Spacing ها در RTL صحیح هستند
- [ ] API ها با هر دو زبان کار می‌کنند

## نکات مهم

### اشتباهات رایج:

❌ **استفاده از text-left/text-right:**
\`\`\`tsx
<div className="text-left">متن</div>  // اشتباه
<div className="text-start">متن</div>  // درست
\`\`\`

❌ **فراموش کردن rtl:space-x-reverse:**
\`\`\`tsx
<div className="flex space-x-4">  // اشتباه
<div className="flex space-x-4 rtl:space-x-reverse">  // درست
\`\`\`

❌ **هاردکد کردن locale:**
\`\`\`tsx
<Link href="/dashboard">  // اشتباه
<Link href={\`/\${locale}/dashboard\`}>  // درست
\`\`\`

## فونت فارسی

برای نمایش بهتر متن فارسی، فونت Vazir توصیه می‌شود:

1. دانلود فونت از: https://github.com/rastikerdar/vazir-font
2. قرار دادن در `public/fonts/`
3. فونت در `globals.css` تنظیم شده است

## پشتیبانی

برای مشکلات و سوالات:
- مستندات next-intl: https://next-intl-docs.vercel.app/
- مستندات date-fns-jalali: https://github.com/date-fns-jalali/date-fns-jalali

---

**نکته:** این سیستم دوزبانه به صورت کامل آماده استفاده است. تمام صفحات کلیدی (login, register, dashboard) به‌روزرسانی شده‌اند و می‌توانید الگوی مشابه را برای سایر صفحات نیز اعمال کنید.
