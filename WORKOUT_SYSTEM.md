# سیستم تمرین ورزشی روزانه (Daily Workout System)

## نمای کلی

یک سیستم جامع برای ردیابی تمرینات bodyweight روزانه شامل 4 ورزش اصلی:
- 💪 Push-up (شنا)
- 🏋️ Pull-up (بارفیکس)
- 🦵 Squat (اسکوات)
- 🧘 Sit-up (دراز و نشست)

## ویژگی‌های اصلی

### 1. برنامه‌ریزی روزانه
- ایجاد خودکار برنامه تمرین برای هر روز
- هدف پیش‌فرض: 100 تکرار برای هر ورزش
- محدودیت زمانی: 60 دقیقه

### 2. ثبت ست‌ها
- امکان ثبت تعداد تکرار در هر ست
- ثبت زمان استراحت بین ست‌ها
- محاسبه خودکار پیشرفت
- حذف ست‌های اشتباه

### 3. تایمر تمرین
- تایمر شمارش به جلو
- کنترل‌های Play/Pause/Reset
- نمایش زمان به فرمت HH:MM:SS

### 4. آنالیز و گزارش
- نمودار خطی روند پیشرفت
- نمودار میله‌ای مقایسه ورزش‌ها
- آمار کامل هر ورزش:
  - کل تکرارها
  - تعداد ست‌ها
  - میانگین تکرار در هر ست
  - بهترین رکورد
- محاسبه استریک (روزهای متوالی تمرین)
- کلندر تمرینات (Heatmap)

### 5. رابط کاربری
- کارت‌های زیبا برای هر ورزش
- نمایش پیشرفت با Progress Bar
- مودال تمام‌صفحه برای جزئیات
- طراحی Responsive (موبایل و دسکتاپ)
- پشتیبانی از زبان فارسی

## ساختار دیتابیس

### WorkoutPlan
```prisma
- id: String
- userId: String
- date: DateTime
- targetReps: Int (default: 100)
- timeLimit: Int (default: 60)
- status: String (pending | in_progress | completed | skipped)
- startedAt: DateTime?
- completedAt: DateTime?
- totalDuration: Int?
```

### DailyExercise
```prisma
- id: String
- workoutPlanId: String
- exerciseType: String (pushup | pullup | squat | situp)
- targetReps: Int
- completedReps: Int
- status: String (pending | completed | skipped)
- notes: String?
- sets: ExerciseSet[]
```

### ExerciseSet
```prisma
- id: String
- dailyExerciseId: String
- setNumber: Int
- reps: Int
- restTime: Int? (seconds)
- createdAt: DateTime
```

## API Endpoints

### Workout Plan
- `GET /api/workout/plan?date=YYYY-MM-DD` - دریافت برنامه روز
- `POST /api/workout/plan` - ایجاد برنامه جدید
- `PATCH /api/workout/plan/[id]` - به‌روزرسانی وضعیت برنامه

### Daily Exercise
- `GET /api/workout/exercise/[id]` - دریافت جزئیات ورزش
- `PATCH /api/workout/exercise/[id]` - به‌روزرسانی ورزش
- `POST /api/workout/exercise/[id]/set` - ثبت ست جدید

### Exercise Set
- `DELETE /api/workout/set/[id]` - حذف ست

### Analytics
- `GET /api/workout/analytics?period=week|month|year|all` - دریافت آمار

## Components

### ExerciseCard
کارت نمایش هر ورزش شامل:
- تصویر ورزش (با emoji)
- نام فارسی و انگلیسی
- Progress Bar
- Badge وضعیت
- دکمه شروع/ادامه

### ExerciseDetailModal
مودال جزئیات شامل:
- اطلاعات هدف و پیشرفت
- تایمر
- فرم ثبت ست جدید
- لیست ست‌های ثبت شده
- پیام تبریک هنگام تکمیل

### ProgressBar
نوار پیشرفت با:
- اندازه‌های مختلف (sm, md, lg)
- رنگ‌های متنوع
- نمایش درصد

### Timer
تایمر با قابلیت:
- شمارش به جلو
- شمارش معکوس
- کنترل‌های Play/Pause/Reset

## صفحات

### /dashboard/workout
صفحه اصلی شامل:
- انتخاب تاریخ
- خلاصه آمار روزانه
- 4 کارت ورزش
- نکات تمرین

### /dashboard/workout/analytics
صفحه آنالیز شامل:
- کارت‌های آمار کلی
- نمودار خطی روند پیشرفت
- نمودار میله‌ای مقایسه
- جدول تفصیلی هر ورزش
- کلندر استریک

## نحوه استفاده

### راه‌اندازی اولیه
```bash
# نصب dependencies
npm install

# اجرای migration
npm run prisma:push

# اجرای برنامه
npm run dev
```

### استفاده از سیستم
1. به صفحه `/dashboard/workout` بروید
2. برنامه روز به صورت خودکار ایجاد می‌شود
3. روی هر کارت کلیک کنید تا مودال باز شود
4. ست‌های خود را ثبت کنید
5. پیشرفت خود را در صفحه Analytics مشاهده کنید

## نکات مهم

### امنیت
- تمام API endpoints نیازمند احراز هویت هستند
- کاربران فقط به داده‌های خود دسترسی دارند
- تمام ورودی‌ها Validate می‌شوند

### عملکرد
- استفاده از Prisma برای کوئری‌های بهینه
- Indexes روی فیلدهای پرکاربرد
- Component‌های Responsive و بهینه

### UX
- Loading states برای همه درخواست‌ها
- Error handling مناسب
- پیام‌های موفقیت و خطا
- طراحی بصری جذاب

## توسعه‌های آینده

### پیشنهادی
- [ ] سیستم Achievements و Badges
- [ ] یادآوری‌های روزانه
- [ ] حالت تاریک
- [ ] صادرات داده به CSV/JSON
- [ ] گالری تصاویر واقعی برای ورزش‌ها
- [ ] راهنمای ویدیویی فرم صحیح
- [ ] مقایسه با دوستان
- [ ] چالش‌های هفتگی

## پشتیبانی

برای گزارش مشکلات یا پیشنهادات:
- Issues در GitHub
- ایمیل به تیم پشتیبانی

---

ساخته شده با ❤️ برای علاقه‌مندان به تناسب اندام
