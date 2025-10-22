# فونت‌های فارسی

برای نمایش بهتر متن فارسی، لطفاً فونت Vazir را از لینک زیر دانلود کرده و در این پوشه قرار دهید:

## دانلود فونت Vazir

1. به آدرس زیر بروید:
   https://github.com/rastikerdar/vazir-font/releases

2. آخرین نسخه را دانلود کنید (مثلاً v33.003)

3. فایل `Vazir-Regular.woff2` را در این پوشه قرار دهید و نام آن را به `Vazir.woff2` تغییر دهید

یا می‌توانید مستقیماً از لینک زیر دانلود کنید:
https://github.com/rastikerdar/vazir-font/releases/download/v33.003/vazir-font-v33.003.zip

## روش جایگزین

می‌توانید از CDN استفاده کنید. در فایل `app/globals.css` خط زیر را اضافه کنید:

```css
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v33.003/dist/font-face.css');
```

و سپس از استایل فعلی که در globals.css موجود است، استفاده کنید.
